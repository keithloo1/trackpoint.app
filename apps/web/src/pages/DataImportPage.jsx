
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DataImportPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect away as this page has been deprecated
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  return null;
};

export default DataImportPage;
