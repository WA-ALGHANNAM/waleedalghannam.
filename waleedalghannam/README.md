# waleedalghannam

موقع وليد الغنام الشخصي مبني باستخدام HTML وCSS وJavaScript وPython (Flask).

## التشغيل محليًا

```bash
python -m pip install -r requirements.txt
python app.py
```

افتح http://127.0.0.1:5000

## النشر على Render

1. أنشئ مستودع GitHub باسم `waleedalghannam`.
2. ارفع **محتويات هذا المجلد** إلى جذر المستودع (لا ترفع ZIP).
3. Render → New → Web Service → Connect GitHub repository.
4. Root Directory: اتركها فارغة.
5. Build Command: `pip install -r requirements.txt`
6. Start Command: `gunicorn app:app`
7. اختر الخطة المناسبة واضغط Deploy Web Service.

> ملاحظة: الرسائل تحفظ في SQLite محليًا وقد تضيع على استضافة ذات نظام ملفات مؤقت. استخدم قاعدة بيانات دائمة قبل الاعتماد على نموذج التواصل في الإنتاج.
