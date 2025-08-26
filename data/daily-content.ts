import type { Hadith, Dua, AsmaulHusna } from '../types';
import { asmaulHusnaData } from './asma-ul-husna';

const dailyAyahs = [
    { text: "قُلْ هُوَ اللَّهُ أَحَدٌ", surahName: "الإخلاص", numberInSurah: 1 },
    { text: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", surahName: "الفاتحة", numberInSurah: 2 },
    { text: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ", surahName: "البقرة", numberInSurah: 152 },
    { text: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا", surahName: "الطلاق", numberInSurah: 2 },
    { text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ", surahName: "الرعد", numberInSurah: 28 },
];

const dailyHadiths: Hadith[] = [
    { id: 1, text: "قال رسول الله صلى الله عليه وسلم: \"إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى.\"", narrator: "رواه البخاري" },
    { id: 2, text: "قال رسول الله صلى الله عليه وسلم: \"الطُّهُورُ شَطْرُ الإِيمَانِ.\"", narrator: "رواه مسلم" },
    { id: 3, text: "قال رسول الله صلى الله عليه وسلم: \"مَنْ قَرَأَ حَرْفًا مِنْ كِتَابِ اللَّهِ فَلَهُ بِهِ حَسَنَةٌ، وَالْحَسَنَةُ بِعَشْرِ أَمْثَالِهَا.\"", narrator: "رواه الترمذي" },
    { id: 4, text: "قال رسول الله صلى الله عليه وسلم: \"الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ.\"", narrator: "رواه البخاري ومسلم" },
    { id: 5, text: "قال رسول الله صلى الله عليه وسلم: \"لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.\"", narrator: "رواه البخاري ومسلم" },
];

const dailyDuas: Dua[] = [
    { id: 1, text: "اللهم آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار." },
    { id: 2, text: "اللهم إنك عفو كريم تحب العفو فاعف عنا." },
    { id: 3, text: "يا مقلب القلوب ثبت قلبي على دينك." },
    { id: 4, text: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً." },
    { id: 5, text: "ربنا لا تزغ قلوبنا بعد إذ هديتنا وهب لنا من لدنك رحمة إنك أنت الوهاب." },
];

const getDayOfYear = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = (now as any) - (start as any) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
};

export const getDailyContent = () => {
    const dayIndex = getDayOfYear();
    
    const ayah = dailyAyahs[dayIndex % dailyAyahs.length];
    const hadith = dailyHadiths[dayIndex % dailyHadiths.length];
    const dua = dailyDuas[dayIndex % dailyDuas.length];
    const asmaulHusna = asmaulHusnaData[dayIndex % asmaulHusnaData.length];

    return { ayah, hadith, dua, asmaulHusna };
};
