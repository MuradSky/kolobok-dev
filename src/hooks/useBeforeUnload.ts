import { useEffect } from 'react';

const useBeforeUnload = (cb: ()=> void,) => {
  useEffect(() => {
    const handleBeforeUnload = () => {
        cb();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });
};

export { useBeforeUnload };
