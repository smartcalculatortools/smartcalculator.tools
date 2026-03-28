import { getAdsTxtContent } from "@/lib/ads";

export function GET() {
  const adsTxtContent = getAdsTxtContent();

  if (!adsTxtContent) {
    return new Response("ads.txt is not configured for this deployment.\n", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return new Response(adsTxtContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
