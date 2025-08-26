import { useCallback } from 'react';

export const useShare = () => {
    const handleShare = useCallback(async (text: string, title: string) => {
        const shareData = {
            title: `أذكاري - ${title}`,
            text: text,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(`${title}:\n${text}`);
                alert("تم نسخ المحتوى إلى الحافظة");
            }
        } catch (err: any) {
            // AbortError is thrown when the user cancels the share dialog, which is not a real error.
            if (err.name !== 'AbortError') {
                console.error("Error sharing content: ", err);
                // As a fallback for other errors, we can still copy to clipboard.
                try {
                    await navigator.clipboard.writeText(`${title}:\n${text}`);
                    alert("حدث خطأ أثناء المشاركة. تم نسخ المحتوى إلى الحافظة.");
                } catch (copyErr) {
                    console.error("Fallback clipboard copy failed: ", copyErr);
                }
            }
        }
    }, []);

    return { handleShare };
};
