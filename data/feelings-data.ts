import type { Feeling, Zikr } from '../types';

export const feelings: Feeling[] = [
    { id: 'happiness', name: 'سعادة', emoji: '😊' },
    { id: 'sadness', name: 'حزن', emoji: '😢' },
    { id: 'anger', name: 'غضب', emoji: '😠' },
    { id: 'anxiety', name: 'قلق', emoji: '😟' },
    { id: 'confusion', name: 'حيرة', emoji: '🤔' },
    { id: 'curiosity', name: 'فضول', emoji: '🧐' },
    { id: 'love', name: 'حب', emoji: '😍' },
    { id: 'weak_iman', name: 'ضعف الايمان', emoji: '😔' },
    { id: 'sickness', name: 'المرض - الرقية الشرعية', emoji: '🤒' },
    { id: 'impatience', name: 'عدم الصبر', emoji: '😫' },
    { id: 'worry', name: 'هم', emoji: '😞' },
    { id: 'comfort', name: 'الراحة', emoji: '😌' },
    { id: 'contentment', name: 'الرضى', emoji: '😇' },
    { id: 'weakness', name: 'الضعف', emoji: '😣' },
    { id: 'fear', name: 'الخوف', emoji: '😨' },
    { id: 'study', name: 'الدراسة', emoji: '🤓' },
    { id: 'laziness', name: 'الكسل', emoji: '😴' },
];

export const feelingsDuas: { [key: string]: Zikr[] } = {
    'happiness': [
        { id: 2001, category: 'happiness', text: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ', count: 1, reference: 'عند رؤية ما يفرحه' },
        { id: 2002, category: 'happiness', text: 'اللَّهُمَّ لَكَ الْحَمْدُ كَمَا يَنْبَغِي لِجَلَالِ وَجْهِكَ وَلِعَظِيمِ سُلْطَانِكَ', count: 1, reference: 'شكرًا لله' },
        { id: 2003, category: 'happiness', text: 'اللهم ما أصبح بي من نعمة أو بأحد من خلقك فمنك وحدك لا شريك لك، فلك الحمد ولك الشكر', count: 1, reference: 'شكر النعمة صباحاً' },
    ],
    'sadness': [
        { id: 2101, category: 'sadness', text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ، وَغَلَبَةِ الرِّجَالِ', count: 1, reference: 'دعاء الهم والحزن' },
        { id: 2102, category: 'sadness', text: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', count: 1, reference: 'دعاء ذي النون' },
        { id: 2103, category: 'sadness', text: 'اللهم رحمتك أرجو فلا تكلني إلى نفسي طرفة عين، وأصلح لي شأني كله، لا إله إلا أنت', count: 1, reference: 'دعاء الكرب' },
    ],
    'anxiety': [
        { id: 2201, category: 'anxiety', text: 'اللهم إني أسألك العفو والعافية في الدنيا والآخرة', count: 1 },
        { id: 2202, category: 'anxiety', text: 'أَعُوذُ بِكَلِمَاتِ اللهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ', count: 3, reference: 'للحفظ من كل شر' },
        { id: 2203, category: 'anxiety', text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ', count: 7, reference: 'يكفيه الله ما أهمه' },
    ],
    'anger': [
        { id: 2301, category: 'anger', text: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', count: 1, reference: 'عند الغضب' },
    ],
    'fear': [
        { id: 2401, category: 'fear', text: 'اللَّهُمَّ اكْفِنِيهِمْ بِمَا شِئْتَ', count: 1, reference: 'دعاء الخوف من قوم' },
        { id: 2402, category: 'fear', text: 'اللهم استر عوراتي، وآمن روعاتي', count: 1, reference: 'من أذكار الصباح والمساء' },
    ],
    'weak_iman': [
        { id: 2501, category: 'weak_iman', text: 'اللهم يا مقلب القلوب ثبت قلبي على دينك', count: 1 },
        { id: 2502, category: 'weak_iman', text: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِنْ لَدُنْكَ رَحْمَةً إِنَّكَ أَنْتَ الْوَهَّابُ', count: 1, reference: 'آل عمران: 8' },
    ],
    'sickness': [
        { id: 2601, category: 'sickness', text: 'أَعُوذُ بِكلِمَاتِ اللهِ التامَّاتِ مِن شَرِّ مَا خَلَق', count: 3 },
        { id: 2602, category: 'sickness', text: 'بِسمِ اللهِ أَرقِيكَ، مِن كُلِّ شَيءٍ يُؤذِيكَ، مِن شَرِّ كُلِّ نَفسٍ أَو عَينِ حَاسِدٍ، اللهُ يَشفِيكَ، بِسمِ اللهِ أَرقِيكَ', count: 1 },
        { id: 2603, category: 'sickness', text: 'اللهم ربَّ الناس، أذهب البأس، اشفِ وأنت الشافي، لا شفاء إلا شفاؤك، شفاءً لا يغادر سقمًا', count: 1 },
    ],
    'laziness': [
        { id: 2701, category: 'laziness', text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ', count: 1 },
        { id: 2702, category: 'laziness', text: 'يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين', count: 1 },
    ]
};
