# قائمة فحص زيادة الزيارات

آخر تحديث: 2026-04-04

## 1. قائمة التشغيل الأسبوعية

### كل يوم اثنين
- [ ] افتح `Google Search Console`
- [ ] راجع `Performance > Search results > Last 28 days`
- [ ] صدّر تقرير `Pages`
- [ ] صدّر تقرير `Queries`
- [ ] سجّل أفضل 20 صفحة في ملف المتابعة
- [ ] راجع `Page indexing`
- [ ] سجّل أرقام الحالات التالية:
  - [ ] `Indexed`
  - [ ] `Discovered - currently not indexed`
  - [ ] `Crawled - currently not indexed`
  - [ ] `Page with redirect`
- [ ] راجع `Core Web Vitals > Mobile`
- [ ] اختر 5 صفحات فقط لتحسينها هذا الأسبوع

### كل يوم أربعاء
- [ ] حسّن صفحتين من صفحات الحاسبات ذات الأولوية
- [ ] حسّن مقال `learn` واحد أو صفحة مقارنة واحدة
- [ ] قوّ الروابط الداخلية بين:
  - [ ] الحاسبة -> التصنيف
  - [ ] الحاسبة -> دليل التعلم
  - [ ] الحاسبة -> مقالات `learn` المرتبطة
  - [ ] مقال `learn` -> الحاسبات
- [ ] اطلب الفهرسة فقط للصفحات التي تغيّرت هذا الأسبوع

### كل يوم جمعة
- [ ] افحص مسارات الإنتاج التالية:
  - [ ] `/`
  - [ ] `/calculators`
  - [ ] `/learn`
  - [ ] `/sitemap.xml`
- [ ] تأكد أن الصفحات الجديدة ترجع `200`
- [ ] دوّن ما تحسن وما توقف وما الذي يجب تأجيله

## 2. قائمة النمو الشهرية

- [ ] انشر من 4 إلى 8 صفحات عالية النية فقط
- [ ] حدّث من 8 إلى 12 صفحة حالية مهمة
- [ ] أنشئ من 8 إلى 12 فيديو قصير يربط كل واحد منها بصفحة واحدة
- [ ] أرسل من 10 إلى 20 رسالة تواصل للحصول على mentions أو links
- [ ] راجع أي تصنيف بدأ يتحرك فعليًا:
  - [ ] `financial`
  - [ ] `ai`
  - [ ] `fitness`
  - [ ] `math`
  - [ ] `other`
  - [ ] `crypto`
- [ ] أوقف نشر الصفحات الضعيفة في التصنيفات التي لا تظهر أي traction

## 3. الصفحات ذات الأولوية الحالية

ابدأ بهذه الصفحات قبل بناء محتوى جديد إضافي:

- [ ] `/calc/mortgage`
- [ ] `/calc/loan`
- [ ] `/calc/compound-interest`
- [ ] `/calc/savings`
- [ ] `/calc/income-tax`
- [ ] `/calc/bmi`
- [ ] `/calc/calorie`
- [ ] `/calc/bmr`
- [ ] `/calc/body-fat`
- [ ] `/calc/scientific`
- [ ] `/calc/percentage`
- [ ] `/calc/fraction`
- [ ] `/calc/triangle`
- [ ] `/calc/age`
- [ ] `/calc/date`
- [ ] `/calc/crypto-profit-loss`
- [ ] `/calc/crypto-dca`
- [ ] `/calc/crypto-fee-impact`
- [ ] `/calc/ai-token-cost`
- [ ] `/calc/ai-model-comparator`

## 4. قائمة فحص المحتوى لأي صفحة جديدة

لا تنشر أي صفحة إلا إذا كانت كل هذه النقاط صحيحة:

- [ ] الصفحة تستهدف استعلامًا حقيقيًا واحدًا أو قرارًا حقيقيًا واحدًا
- [ ] الصفحة تربط إلى حاسبتين مرتبطتين على الأقل
- [ ] الصفحة تربط رجوعًا إلى صفحة التصنيف الخاصة بها
- [ ] الصفحة تربط إلى دليل `learn` الخاص بها عند وجوده
- [ ] العنوان محدد وليس عامًا
- [ ] الوصف التعريفي يشرح الفائدة بوضوح
- [ ] الفقرة الافتتاحية تشرح لمن هذه الصفحة
- [ ] الصفحة تحتوي على FAQ أو guidance أو scenario واضح
- [ ] الصفحة مرتبطة داخليًا من صفحة موجودة واحدة على الأقل

## 5. خطوات تخصك أنت فقط: Google Search Console

هذه الخطوات تحتاج حسابك في Google ولا يمكن تنفيذها من داخل الكود.

### إرسال الـ sitemap والتأكد منها
1. افتح `https://search.google.com/search-console`
2. اختر الـ property الخاصة بـ `smartcalculatortools.net`
3. من القائمة الجانبية اليسرى اضغط `Sitemaps`
4. داخل `Add a new sitemap` اكتب:
   - `sitemap.xml`
5. اضغط `Submit`
6. تأكد أن حالة الـ sitemap ناجحة

### تصدير بيانات الصفحات والكلمات
1. افتح `Performance`
2. اضغط `Search results`
3. غيّر التاريخ إلى `Last 28 days`
4. فعّل هذه المؤشرات:
   - `Total clicks`
   - `Total impressions`
   - `Average CTR`
   - `Average position`
5. افتح تبويب `Pages`
6. اضغط `Export`
7. احفظ الملف باسم `gsc-pages-last-28-days.csv`
8. افتح تبويب `Queries`
9. اضغط `Export`
10. احفظ الملف باسم `gsc-queries-last-28-days.csv`

### طلب الفهرسة للروابط ذات الأولوية
1. انسخ رابطًا واحدًا، مثل:
   - `https://smartcalculatortools.net/calculators`
2. الصقه في شريط `Inspect any URL` أعلى الصفحة
3. انتظر نتيجة الفحص
4. اضغط `Request indexing`
5. كرر هذا فقط مع مجموعة صغيرة من الروابط التي تغيّرت:
   - `/calculators`
   - `/learn`
   - `/category/financial`
   - `/category/ai`
   - `/calc/mortgage`
   - `/calc/loan`
   - `/calc/ai-token-cost`
   - من 3 إلى 5 مقالات `learn` جديدة

### مراجعة الفهرسة
1. افتح `Indexing > Pages`
2. سجّل أرقام الحالات التالية:
   - `Indexed`
   - `Discovered - currently not indexed`
   - `Crawled - currently not indexed`
   - `Page with redirect`
3. إذا زادت حالتا `Discovered` أو `Crawled` بشكل واضح، لا تنشر دفعة كبيرة جديدة في ذلك الأسبوع

## 6. خطوات تخصك أنت فقط: Google Analytics 4

إذا لم يكن `GA4` مفعّلًا بعد، نفّذ هذا بالترتيب:

1. افتح `https://analytics.google.com`
2. اضغط `Admin`
3. اضغط `Create`
4. اختر `Property`
5. سمّها `Smart Calculator Tools`
6. أكمل إنشاء الـ property
7. أنشئ `Web data stream`
8. استخدم الدومين:
   - `https://smartcalculatortools.net`
9. انسخ `Measurement ID` الذي يبدأ بـ `G-`
10. افتح مشروعك على `Vercel`
11. افتح `Settings`
12. افتح `Environment Variables`
13. أضف المتغير التالي:
   - Key: `NEXT_PUBLIC_GA_ID`
   - Value: قيمة `G-...` الخاصة بك
14. احفظ المتغير
15. أعد نشر الإنتاج
16. افتح `GA4 > Realtime`
17. افتح الموقع من نافذة `incognito`
18. تأكد أن زيارتك ظهرت في الوقت الحقيقي

## 7. خطوات تخصك أنت فقط: Bing Webmaster Tools

هذا اختياري لكنه مفيد.

1. افتح `https://www.bing.com/webmasters`
2. سجّل الدخول
3. أضف الموقع
4. استورد الموقع من Google Search Console إذا ظهر لك الخيار
5. تأكد من إرسال الـ sitemap
6. راقب عدد الصفحات المفهرسة هناك مرة كل شهر

## 8. خطوات تخصك أنت فقط: إنشاء ملف متابعة

أنشئ Google Sheet أو Excel بهذه الأعمدة:

- `URL`
- `Page type`
- `Cluster`
- `Clicks`
- `Impressions`
- `CTR`
- `Avg position`
- `Indexed`
- `Last updated`
- `Next action`
- `Priority`
- `Notes`

حدّث هذا الملف مرة واحدة أسبوعيًا، وليس بشكل عشوائي.

## 9. ما يمكن لـ Codex مواصلة تنفيذه داخل المشروع

- [ ] تحسين نصوص الحاسبات ذات الأولوية
- [ ] إضافة صفحات مقارنة أقوى
- [ ] تقوية الربط الداخلي
- [ ] تحسين أهلية الظهور الغني في النتائج
- [ ] تحسين `CTR` عبر عناوين ووصف أقوى
- [ ] بناء صفحات أفضل لجلب استخدام `embed`

## 10. ما يجب تجنبه

- [ ] لا تنشر مقالات `blog` لا علاقة لها بالحاسبات
- [ ] لا تنشر صفحات متشابهة جدًا أو شبه مكررة
- [ ] لا تطلب الفهرسة لعشرات الصفحات كل يوم
- [ ] لا تشتر `backlinks`
- [ ] لا تطارد الزيارات عبر صفحات ضعيفة بلا ارتباط واضح بالحاسبات
