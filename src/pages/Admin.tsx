
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Перенаправляем на дашборд
    navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  return null;
};

export default Admin;
