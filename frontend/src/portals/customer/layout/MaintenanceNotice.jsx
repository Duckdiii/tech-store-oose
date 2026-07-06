import { useTheme } from '../../../shared/context/ThemeContext';

export function MaintenanceNotice() {
  const { t } = useTheme();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', gap: 16, padding: 24, textAlign: 'center', background: '#f8fafc',
    }}>
      <span style={{ fontSize: 56 }}>🛠️</span>
      <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0d1117', margin: 0 }}>
        {t('Hệ thống đang bảo trì')}
      </h1>
      <p style={{ fontSize: 14, color: '#6b7280', maxWidth: 420, margin: 0, lineHeight: 1.6 }}>
        {t('Chúng tôi đang khôi phục dữ liệu để đảm bảo hệ thống hoạt động ổn định. Vui lòng quay lại sau ít phút.')}
      </p>
    </div>
  );
}
