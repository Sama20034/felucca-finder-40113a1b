

## المشكلة
رابط الدعوة بيوجّه المستخدم على `localhost:3000` بدل عنوان الموقع الفعلي. ده لأن Supabase بيستخدم الـ Site URL المحدد في إعدادات المشروع كـ redirect URL افتراضي.

## الحل

### 1. تعديل Edge Function `invite-admin`
نضيف `redirectTo` في استدعاء `inviteUserByEmail` عشان يوجّه على الموقع الصحيح:

```typescript
await adminClient.auth.admin.inviteUserByEmail(email, {
  redirectTo: 'https://felucca-finder.lovable.app/auth'
});
```

### 2. تحديث Site URL في Supabase Dashboard
الأهم: لازم تروح على Supabase Dashboard → Authentication → URL Configuration وتغيّر الـ Site URL من `localhost:3000` إلى `https://felucca-finder.lovable.app`.

ده بيأثر على كل الإيميلات (دعوات، تأكيد حساب، إلخ).

### 3. إضافة Redirect URL في Supabase
تضيف `https://felucca-finder.lovable.app/**` في قائمة الـ Redirect URLs المسموحة.

