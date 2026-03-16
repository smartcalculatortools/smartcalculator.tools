# REFERENCE_CHECKS - الدفعة الأولى

آخر تحديث: 2026-03-15

## منهجية سريعة
- نفس المدخلات الافتراضية الموجودة في صفحات الحاسبات.
- النتائج محسوبة وفق الصيغ المعتمدة في الكود، ثم تم التحقق بمراجع خارجية.
- التقريب: القيم المالية إلى رقمين عشريين، والقيم الصحية إلى رقمين عشريين.

## 1) Mortgage Calculator (الدفعات)
- المدخلات: سعر المنزل 420,000، دفعة مقدمة 15%، فائدة سنوية 6.2%، مدة 30 سنة.
- مرجع الصيغة: amortization (دفعة القرض الثابتة).
- المتوقع (P&I): 2,186.51
- ناتج موقعنا: 2,186.51
- الحالة: ✅ متطابق
- المصدر: https://www2.victoriacollege.edu/~myosko/financeformulas%28with-explanation%29.pdf

## 2) Loan Calculator
- المدخلات: أصل القرض 25,000، فائدة سنوية 7.5%، مدة 5 سنوات.
- مرجع الصيغة: amortization (دفعة القرض الثابتة).
- المتوقع (الدفعة الشهرية): 500.95
- ناتج موقعنا: 500.95
- الحالة: ✅ متطابق
- المصدر: https://www2.victoriacollege.edu/~myosko/financeformulas%28with-explanation%29.pdf

## 3) Compound Interest Calculator
- المدخلات: أصل 10,000، فائدة سنوية 5%، 10 سنوات، إيداع شهري 100، تعويم شهري.
- مرجع الصيغ: 
  - Compound interest A = P(1 + r/n)^(nt)
  - Future value of annuity A = P * ((1 + r/n)^(nt) - 1) / (r/n)
- المتوقع (Future value): 31,998.32
- ناتج موقعنا: 31,998.32
- الحالة: ✅ متطابق
- المصدر: https://www2.victoriacollege.edu/~myosko/financeformulas%28with-explanation%29.pdf

## 4) Savings Calculator
- المدخلات: رصيد ابتدائي 4,000، إيداع شهري 250، فائدة سنوية 3.5%، 5 سنوات، تعويم شهري.
- مرجع الصيغ: compound interest + future value of annuity.
- المتوقع (Future value): 21,130.30
- ناتج موقعنا: 21,130.30
- الحالة: ✅ متطابق
- المصدر: https://www2.victoriacollege.edu/~myosko/financeformulas%28with-explanation%29.pdf

## 5) Income Tax Calculator (تبسيط)
- المدخلات: دخل إجمالي 90,000، خصومات 15,000، نسبة ضريبة 20%.
- مرجع الفكرة: الدخل الخاضع للضريبة = الدخل الإجمالي ناقص الخصومات.
- المتوقع:
  - Taxable income = 75,000
  - Tax = 15,000
  - Net income = 75,000
- ناتج موقعنا: مطابق.
- الحالة: ✅ متطابق
- المصدر: https://www.irs.gov/pub/irs-wd/01-0028.pdf

## 6) BMI Calculator
- المدخلات: وزن 70 كجم، طول 175 سم.
- مرجع الصيغة: BMI = الوزن بالكجم / (الطول بالمتر)^2.
- المتوقع: 22.86 (تصنيف Healthy/Normal).
- ناتج موقعنا: 22.86 (Normal).
- الحالة: ✅ متطابق
- المصادر:
  - https://www.cancer.org/cancer/risk-prevention/diet-physical-activity/body-weight-and-cancer-risk/body-mass-index-bmi-calculator.html
  - https://www.cdc.gov/bmi/adult-calculator/bmi-categories.html

## 7) BMR Calculator (Mifflin-St Jeor)
- المدخلات: ذكر، 70 كجم، 175 سم، عمر 30.
- مرجع الصيغة: 
  - رجال: 10*الوزن + 6.25*الطول - 5*العمر + 5
- المتوقع: 1,648.75 kcal/day
- ناتج موقعنا: 1,648.75 kcal/day
- الحالة: ✅ متطابق
- المصدر: https://pubmed.ncbi.nlm.nih.gov/2305711/

## 8) Calorie Calculator (Maintenance)
- المدخلات: نفس مدخلات BMR + نشاط Moderate.
- مرجع الفكرة: السعرات = BMR * معامل النشاط.
- معامل Moderate = 1.55
- المتوقع: 2,555.56 kcal/day
- ناتج موقعنا: 2,555.56 kcal/day
- الحالة: ✅ متطابق
- المصدر: https://goldringcenter.tulane.edu/wp-content/uploads/sites/10/2025/04/CME-Module-2-Weight-Mgmt-In-Class-PPT.pdf

## 9) Body Fat Calculator (US Navy)
- المدخلات: ذكر، طول 180 سم، خصر 90 سم، رقبة 40 سم.
- مرجع الصيغة (رجال):
  %BF = 86.010*log10(waist - neck) - 70.041*log10(height) + 36.76
- المتوقع: 18.46%
- ناتج موقعنا: 18.46%
- الحالة: ✅ متطابق
- المصدر: https://api.army.mil/e2/c/downloads/566071.pdf

## 10) Scientific Calculator (تحقق سريع)
- اختبارات مرجعية:
  - sin(30°) = 0.5
  - cos(60°) = 0.5
- ناتج موقعنا: مطابق للقيم المرجعية.
- الحالة: ✅ متطابق
- المصدر: https://education.ti.com/-/media/ti/education/files/ib/pdf/unit-circle_ib-question.pdf
