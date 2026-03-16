import json
import os
import subprocess
import sys
from pathlib import Path

from bs4 import BeautifulSoup


EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
LOCAL_BASE = "http://localhost:3000"

VIEWPORTS = {
    "desktop": (1280, 720),
}

MOBILE_VIEWPORTS = {
    "mobile": (390, 844),
}

TAKE_SCREENSHOTS = os.environ.get("VISUAL_AUDIT_SCREENSHOTS", "0") == "1"
INCLUDE_MOBILE = os.environ.get("VISUAL_AUDIT_MOBILE", "0") == "1"

CALCULATORS = [
    {
        "slug": "mortgage",
        "name": "Mortgage Calculator",
        "competitor": "https://www.calculator.net/mortgage-calculator.html",
    },
    {
        "slug": "loan",
        "name": "Loan Calculator",
        "competitor": "https://www.calculator.net/loan-calculator.html",
    },
    {
        "slug": "compound-interest",
        "name": "Compound Interest Calculator",
        "competitor": "https://www.calculator.net/compound-interest-calculator.html",
    },
    {
        "slug": "savings",
        "name": "Savings Calculator",
        "competitor": "https://www.calculator.net/savings-calculator.html",
    },
    {
        "slug": "income-tax",
        "name": "Income Tax Calculator",
        "competitor": "https://www.calculator.net/income-tax-calculator.html",
    },
    {
        "slug": "bmi",
        "name": "BMI Calculator",
        "competitor": "https://www.calculator.net/bmi-calculator.html",
    },
    {
        "slug": "calorie",
        "name": "Calorie Calculator",
        "competitor": "https://www.calculator.net/calorie-calculator.html",
    },
    {
        "slug": "bmr",
        "name": "BMR Calculator",
        "competitor": "https://www.calculator.net/bmr-calculator.html",
    },
    {
        "slug": "body-fat",
        "name": "Body Fat Calculator",
        "competitor": "https://www.calculator.net/body-fat-calculator.html",
    },
    {
        "slug": "scientific",
        "name": "Scientific Calculator",
        "competitor": "https://www.calculator.net/scientific-calculator.html",
    },
    {
        "slug": "percentage",
        "name": "Percentage Calculator",
        "competitor": "https://www.calculator.net/percent-calculator.html",
    },
    {
        "slug": "fraction",
        "name": "Fraction Calculator",
        "competitor": "https://www.calculator.net/fraction-calculator.html",
    },
    {
        "slug": "triangle",
        "name": "Triangle Calculator",
        "competitor": "https://www.calculator.net/triangle-calculator.html",
    },
    {
        "slug": "age",
        "name": "Age Calculator",
        "competitor": "https://www.calculator.net/age-calculator.html",
    },
    {
        "slug": "date",
        "name": "Date Calculator",
        "competitor": "https://www.calculator.net/date-calculator.html",
    },
    {
        "slug": "crypto-profit-loss",
        "name": "Crypto Profit/Loss Calculator",
        "competitor": None,
    },
    {
        "slug": "crypto-dca",
        "name": "Crypto DCA Calculator",
        "competitor": None,
    },
    {
        "slug": "crypto-fee-impact",
        "name": "Crypto Fee Impact Calculator",
        "competitor": None,
    },
    {
        "slug": "ai-token-cost",
        "name": "AI Token Cost Calculator",
        "competitor": None,
    },
    {
        "slug": "ai-model-comparator",
        "name": "AI Model Cost Comparator",
        "competitor": None,
    },
]


def run_edge(args, timeout=120):
    result = subprocess.run(
        [EDGE_PATH, *args],
        capture_output=True,
        text=True,
        timeout=timeout,
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Edge failed")
    return result.stdout


def capture_dom(url, out_path, viewport):
    width, height = viewport
    html = run_edge(
        [
            "--headless",
            "--disable-gpu",
            f"--window-size={width},{height}",
            "--virtual-time-budget=8000",
            "--dump-dom",
            url,
        ]
    )
    out_path.write_text(html, encoding="utf-8")
    return html


def capture_screenshot(url, out_path, viewport):
    width, height = viewport
    run_edge(
        [
            "--headless",
            "--disable-gpu",
            f"--window-size={width},{height}",
            "--hide-scrollbars",
            f"--screenshot={out_path}",
            url,
        ]
    )


def extract_metrics(html):
    soup = BeautifulSoup(html, "html.parser")
    container = (
        soup.select_one("#content")
        or soup.select_one("main")
        or soup.select_one("[data-testid='calculator']")
        or soup.body
    )
    if not container:
        return {
            "title": "",
            "h1": [],
            "h2": [],
            "labels": 0,
            "inputs": 0,
            "selects": 0,
            "buttons": 0,
            "tables": 0,
            "has_results": False,
            "has_schedule": False,
            "has_chart": False,
        }

    def text_list(tag):
        return [
            item.get_text(" ", strip=True)
            for item in container.find_all(tag)
            if item.get_text(strip=True)
        ]

    text_blob = container.get_text(" ", strip=True).lower()

    return {
        "title": (soup.title.string or "").strip() if soup.title else "",
        "h1": text_list("h1"),
        "h2": text_list("h2"),
        "labels": len(container.find_all("label")),
        "inputs": len(container.find_all("input")),
        "selects": len(container.find_all("select")),
        "buttons": len(container.find_all("button")),
        "tables": len(container.find_all("table")),
        "has_results": "result" in text_blob,
        "has_schedule": "schedule" in text_blob or "amortization" in text_blob,
        "has_chart": "chart" in text_blob or "graph" in text_blob,
    }


def format_delta(local_value, competitor_value):
    if competitor_value is None:
        return "n/a"
    return f"{local_value}/{competitor_value}"


def main():
    if not os.path.exists(EDGE_PATH):
        print("Edge not found:", EDGE_PATH)
        sys.exit(1)

    output_dir = Path("visual-audit")
    dom_dir = output_dir / "dom"
    shots_dir = output_dir / "screenshots"
    output_dir.mkdir(exist_ok=True)
    dom_dir.mkdir(exist_ok=True)
    shots_dir.mkdir(exist_ok=True)

    report_rows = []
    summary_flags = []

    for calc in CALCULATORS:
        slug = calc["slug"]
        local_url = f"{LOCAL_BASE}/calc/{slug}"
        competitor_url = calc["competitor"]

        local_metrics = {}
        competitor_metrics = {}

        active_viewports = dict(VIEWPORTS)
        if INCLUDE_MOBILE:
            active_viewports.update(MOBILE_VIEWPORTS)

        for viewport_name, viewport in active_viewports.items():
            local_dom_path = dom_dir / f"local-{slug}-{viewport_name}.html"
            local_html = capture_dom(local_url, local_dom_path, viewport)
            if TAKE_SCREENSHOTS:
                local_shot_path = shots_dir / f"local-{slug}-{viewport_name}.png"
                capture_screenshot(local_url, local_shot_path, viewport)

            if viewport_name == "desktop":
                local_metrics = extract_metrics(local_html)

            if competitor_url:
                competitor_dom_path = dom_dir / f"competitor-{slug}-{viewport_name}.html"
                competitor_html = capture_dom(competitor_url, competitor_dom_path, viewport)
                if TAKE_SCREENSHOTS:
                    competitor_shot_path = shots_dir / f"competitor-{slug}-{viewport_name}.png"
                    capture_screenshot(competitor_url, competitor_shot_path, viewport)

                if viewport_name == "desktop":
                    competitor_metrics = extract_metrics(competitor_html)

        flags = []
        if competitor_url:
            if local_metrics.get("inputs", 0) + 2 < competitor_metrics.get("inputs", 0):
                flags.append("local inputs أقل بشكل واضح")
            if local_metrics.get("tables", 0) + 1 < competitor_metrics.get("tables", 0):
                flags.append("local tables أقل")
            if competitor_metrics.get("has_schedule") and not local_metrics.get("has_schedule"):
                flags.append("local schedule غير ظاهر")
            if competitor_metrics.get("has_chart") and not local_metrics.get("has_chart"):
                flags.append("local chart/graph غير ظاهر")
        else:
            flags.append("لا يوجد مكافئ مباشر على calculator.net")

        if flags:
            summary_flags.append({"slug": slug, "flags": flags})

        report_rows.append(
            {
                "slug": slug,
                "name": calc["name"],
                "local_url": local_url,
                "competitor_url": competitor_url,
                "local": local_metrics,
                "competitor": competitor_metrics,
                "flags": flags,
            }
        )

    (output_dir / "report.json").write_text(
        json.dumps(report_rows, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    report_lines = []
    report_lines.append("Visual Audit Report")
    report_lines.append("")
    report_lines.append("Summary flags")
    report_lines.append("")
    if summary_flags:
        for item in summary_flags:
            report_lines.append(f"- {item['slug']}: {', '.join(item['flags'])}")
    else:
        report_lines.append("- no flags")

    report_lines.append("")
    report_lines.append("Per calculator")
    report_lines.append("")

    for row in report_rows:
        report_lines.append(f"{row['name']} ({row['slug']})")
        report_lines.append(f"Local: {row['local_url']}")
        report_lines.append(f"Competitor: {row['competitor_url'] or 'n/a'}")
        report_lines.append(
            "Counts (local/competitor): "
            f"inputs {format_delta(row['local'].get('inputs', 0), row['competitor'].get('inputs'))}, "
            f"selects {format_delta(row['local'].get('selects', 0), row['competitor'].get('selects'))}, "
            f"tables {format_delta(row['local'].get('tables', 0), row['competitor'].get('tables'))}, "
            f"buttons {format_delta(row['local'].get('buttons', 0), row['competitor'].get('buttons'))}"
        )
        report_lines.append(
            "Sections (local/competitor): "
            f"results {format_delta(row['local'].get('has_results', False), row['competitor'].get('has_results'))}, "
            f"schedule {format_delta(row['local'].get('has_schedule', False), row['competitor'].get('has_schedule'))}, "
            f"chart {format_delta(row['local'].get('has_chart', False), row['competitor'].get('has_chart'))}"
        )
        if row["flags"]:
            report_lines.append(f"Flags: {', '.join(row['flags'])}")
        if TAKE_SCREENSHOTS:
            report_lines.append(
                "Screenshots: "
                f"{shots_dir / ('local-' + row['slug'] + '-desktop.png')} | "
                f"{shots_dir / ('competitor-' + row['slug'] + '-desktop.png') if row['competitor_url'] else 'n/a'}"
            )
        report_lines.append("")

    (output_dir / "report.md").write_text("\n".join(report_lines), encoding="utf-8")


if __name__ == "__main__":
    main()
