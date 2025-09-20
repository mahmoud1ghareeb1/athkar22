import React, { useEffect, useState } from 'react';

const InstallPrompt: React.FC = () => {
  const [deferred, setDeferred] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const installed = window.matchMedia?.('(display-mode: standalone)').matches || (navigator as any).standalone;
    if (installed) return;

    const onBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferred(e);
      const shown = localStorage.getItem('pwa_prompt_shown');
      if (!shown) {
        setVisible(true);
      }
    };

    const onInstalled = () => {
      setVisible(false);
      setDeferred(null);
      localStorage.setItem('pwa_prompt_shown', '1');
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferred) return;
    try {
      const choice = await deferred.prompt();
      if (choice?.outcome === 'accepted') {
        localStorage.setItem('pwa_prompt_shown', '1');
        setVisible(false);
      }
    } catch {}
  };

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem('pwa_prompt_shown', '1');
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 right-4 left-4 z-50">
      <div className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-4 flex items-center justify-between">
        <div className="text-gray-200 text-sm">ثبّت التطبيق على هاتفك لتجربة أفضل والعمل دون إنترنت.</div>
        <div className="flex items-center gap-2">
          <button onClick={handleDismiss} className="px-3 py-1.5 text-gray-300 hover:text-white">لاحقاً</button>
          <button onClick={handleInstall} className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold">تثبيت</button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
