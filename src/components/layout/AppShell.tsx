"use client";

import React, { useState, useMemo } from 'react';
import {
  Shield,
  LayoutDashboard,
  FolderKanban,
  Layers,
  Smartphone,
  MapPin,
  Cctv,
  Car,
  BrainCircuit,
  Share2,
  FileLock2,
  FileText,
  Users,
  ShieldCheck,
  Search,
  Bell,
  Play,
  Presentation,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
  Volume2,
  VolumeX,
  Eye,
  Languages,
} from 'lucide-react';
import { useSentinel } from '@/context/SentinelContext';
import { ModuleId, UserRole } from '@/types/sentinel';
import { GuidedPresentationBar } from '@/components/guided/GuidedPresentationBar';

interface NavItem {
  id: ModuleId;
  label: string;
  labelHi: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  plainExplanation: string;
  plainExplanationHi: string;
  voiceCommentary: string;
  voiceCommentaryHi: string;
  voiceCommentaryHinglish: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'command-centre',
    label: 'Command Centre',
    labelHi: 'कमांड सेंटर (मुख्य डैशबोर्ड)',
    shortLabel: 'Command',
    icon: LayoutDashboard,
    plainExplanation: 'Executive overview of the Aarav Sharma missing person investigation, 8 Smart Criminal vs. Sovereign Trap scenarios, and one-click Voice-Guided Demo in English & Hindi.',
    plainExplanationHi: 'आरव शर्मा अपहरण जांच का मुख्य डैशबोर्ड — यहाँ 8 शातिर अपराधी चालें बनाम प्रोजेक्ट चक्रव्यूह के सरकारी जाल और एक-क्लिक हिंदी/इंग्लिश वॉइस डेमो उपलब्ध है।',
    voiceCommentary:
      'Welcome to Project Chakravyuh. Software architect Aarav Sharma goes missing at 6:30 PM, and his sister Ananya Sharma files a complaint at 9:15 PM. Click Start Voice Guided Demo to watch and listen in English or Hindi as the platform connects mobile, CCTV, electricity meter, bus dashcam, and FASTag evidence.',
    voiceCommentaryHi:
      'प्रोजेक्ट चक्रव्यूह में आपका स्वागत है। शाम साढ़े छह बजे आरव शर्मा लापता होते हैं और रात सवा नौ बजे उनकी बहन अनन्या शर्मा शिकायत दर्ज कराती हैं। वॉइस डेमो बटन दबाकर हिंदी या इंग्लिश में सुनिए कि कैसे चक्रव्यूह अपराधी की हर चालाकी को सरकारी ग्रिड से पकड़ता है।',
    voiceCommentaryHinglish:
      'Project Chakravyuh mein aapka swagat hai. Shaam saadhe chhah baje Aarav Sharma laapata hote hain aur raat sawa nau baje unki behen Ananya Sharma shikayat darj karati hain. Voice Demo button dabakar Hindi ya English mein suniye ki kaise Chakravyuh apradhi ki har chaalaki ko sarkari grid se pakadta hai.',
  },
  {
    id: 'cases',
    label: '1. Incident Registration',
    labelHi: '1. शिकायत पंजीकरण (FIR)',
    shortLabel: 'Cases',
    icon: FolderKanban,
    badge: 'Stage 1',
    plainExplanation: 'Stage 1: Registers the complaint for Aarav Sharma and uses ICJS/CCTNS national grid to link 4 cross-station rehearsal cases.',
    plainExplanationHi: 'चरण 1: आरव शर्मा की गुमशुदगी दर्ज करता है और राष्ट्रीय पुलिस ग्रिड (CCTNS) से 4 अलग-अलग थानों के केसों को आपस में जोड़ता है।',
    voiceCommentary:
      'Stage 1, Incident Registration. Here Inspector Vikram Rao registers the missing person case for Aarav Sharma and links four cross-jurisdiction police stations through the national crime grid.',
    voiceCommentaryHi:
      'चरण एक, शिकायत पंजीकरण। यहाँ इंस्पेक्टर विक्रम राव आरव शर्मा का केस दर्ज करते हैं और नेशनल पुलिस ग्रिड के ज़रिए चार अलग-अलग थानों के सबूतों को एक साथ जोड़ते हैं।',
    voiceCommentaryHinglish:
      'Charan ek, Shikayat Panjikaran. Yahan Inspector Vikram Rao Aarav Sharma ka case darj karte hain aur National Police Grid ke zariye chaar alag alag thaano ke sabooton ko ek saath jodte hain.',
  },
  {
    id: 'workspace',
    label: '2. Evidence Ingestion',
    labelHi: '2. सभी सरकारी सबूतों का एकीकरण',
    shortLabel: 'Ingestion',
    icon: Layers,
    badge: 'Stage 2',
    plainExplanation: 'Stage 2: Connects 7 sovereign data streams (telecom, CCTV, smart electricity meter, ATM/POS recharge logs, witnesses) with SHA-256 locks.',
    plainExplanationHi: 'चरण 2: 7 सरकारी स्रोतों (मोबाइल टावर, CCTV, स्मार्ट बिजली मीटर, ATM कैश रिचार्ज, गवाह) को SHA-256 डिजिटल लॉक के साथ जोड़ता है।',
    voiceCommentary:
      'Stage 2, Multi Source Evidence Ingestion. Authorized telecom records, smart electricity meter logs, ATM cash recharge records, and witness statements flow into the central engine with SHA-256 cryptographic hashes.',
    voiceCommentaryHi:
      'चरण दो, सबूतों का एकीकरण। यहाँ मोबाइल टावर, स्मार्ट बिजली मीटर, एटीएम कैश रिचार्ज और गवाहों के बयान डिजिटल लॉक के साथ एक ही टाइमलाइन पर जुड़ते हैं।',
    voiceCommentaryHinglish:
      'Charan do, Sabooton ka Ekikaran. Yahan mobile tower, smart bijli meter, ATM cash recharge aur gawahon ke bayaan digital lock ke saath ek hi timeline par judte hain.',
  },
  {
    id: 'mobile-intelligence',
    label: '3. Mobile Intelligence',
    labelHi: '3. मोबाइल और स्मार्ट मीटर जांच',
    shortLabel: 'Mobile',
    icon: Smartphone,
    badge: 'Stage 3',
    plainExplanation: 'Stage 3: Exposes the Faraday bag drop at 18:48, busts Karan Malhotra’s fake home phone alibi via smart meter logs, and clears innocent commuter Rohan Verma.',
    plainExplanationHi: 'चरण 3: 6:48 पर फ़ैराडे बैग साज़िश पकड़ता है, स्मार्ट बिजली मीटर से करण मल्होत्रा का झूठा घर वाला बहाना बेनकाब करता है और निर्दोष रोहन वर्मा को क्लीन चिट देता है।',
    voiceCommentary:
      'Stage 3, Mobile Intelligence. Aarav Sharma’s iPhone is placed in a signal-blocking Faraday bag at 6:48 PM. Suspect Karan Malhotra leaves his personal phone at home as a fake alibi, but his smart electricity meter flatlines at 138 watts, proving his apartment was empty.',
    voiceCommentaryHi:
      'चरण तीन, मोबाइल और स्मार्ट मीटर जांच। अपराधी ने अपना असली फ़ोन घर पर छोड़ दिया ताकि लगे वह घर पर सो रहा है, लेकिन स्मार्ट बिजली मीटर ने दिखा दिया कि घर खाली था। वहीं निर्दोष नागरिक रोहन वर्मा को तुरंत क्लीन चिट मिल जाती है।',
    voiceCommentaryHinglish:
      'Charan teen, Mobile aur Smart Meter Jaanch. Apradhi ne apna asli phone ghar par chhod diya taaki lage woh ghar par so raha hai, lekin smart bijli meter ne dikha diya ki ghar khaali tha. Wahin nirdosh naagrik Rohan Verma ko turant clean chit mil jaati hai.',
  },
  {
    id: 'location-intelligence',
    label: '4. Map & CCTV Discovery',
    labelHi: '4. नक्शा, CCTV और बस डैशकैम',
    shortLabel: 'Map / GIS',
    icon: MapPin,
    badge: 'Stage 4',
    plainExplanation: 'Stage 4: Discovers 20 corridor cameras and defeats the CAM-008 power-cut blind spot by pulling a passing BMTC Route-335E Bus ADAS dashcam.',
    plainExplanationHi: 'चरण 4: 20 CCTV कैमरे खोजता है और जब अपराधी बंद कैमरे (CAM-008) का फायदा उठाता है, तो वहाँ से गुज़री सरकारी बस (BMTC 335E) के डैशकैम से उसे पकड़ लेता है।',
    voiceCommentary:
      'Stage 4, Map and C C T V Discovery. The suspect chose the pickup lay-by because camera 008 was offline for battery maintenance. Project Chakravyuh checks city transit GPS and pulls the front dashcam of a BMTC electric bus that drove right past the lay-by at 6:49 PM.',
    voiceCommentaryHi:
      'चरण चार, नक्शा और बस डैशकैम जाल। अपराधी ने ऐसी जगह चुनी जहाँ सड़क का कैमरा बैटरी रिपेयर के कारण बंद था। लेकिन चक्रव्यूह ने ठीक उसी वक्त वहाँ से गुज़री सरकारी बस के डैशकैम से सफ़ेद एसयूवी का वीडियो निकाल लिया।',
    voiceCommentaryHinglish:
      'Charan chaar, Naksha aur Bus Dashcam Jaal. Apradhi ne aisi jagah chuni jahan sadak ka camera battery repair ke kaaran band tha. Lekin Chakravyuh ne theek usi waqt wahan se guzri sarkari bus ke dashcam se safed SUV ka video nikaal liya.',
  },
  {
    id: 'cctv-intelligence',
    label: '5. Video Footage Review',
    labelHi: '5. वीडियो जांच और FASTag मिलान',
    shortLabel: 'Video Review',
    icon: Cctv,
    badge: 'Stage 5',
    plainExplanation: 'Stage 5: Reviews video feeds and defeats cloned plates & high-beam glare using NHAI FASTag Ghost-Tag exceptions and 433MHz tyre sensor IDs.',
    plainExplanationHi: 'चरण 5: नकली नंबर प्लेट और तेज़ हेडलाइट की चालाकी को टोल बूथ के बिना-FASTag अलर्ट और टायर प्रेशर सेंसर (TPMS) की रेडियो आईडी से पकड़ता है।',
    voiceCommentary:
      'Stage 5, Video Footage Review. The criminal used high-beam glare and a cloned number plate. Project Chakravyuh catches the SUV using the overhead FASTag reader Ghost-Tag exception and the unchangeable 433 megahertz tyre pressure sensor ID inside its wheels.',
    voiceCommentaryHi:
      'चरण पाँच, वीडियो और फास्टैग जांच। अपराधी ने नकली नंबर प्लेट लगाई और फास्टैग उखाड़ दिया। लेकिन ऊपर लगे फास्टैग रीडर और पहियों के अंदर लगे टायर सेंसर की रेडियो आईडी ने साबित कर दिया कि दोनों जगह एक ही गाड़ी थी।',
    voiceCommentaryHinglish:
      'Charan paanch, Video aur FASTag Jaanch. Apradhi ne nakli number plate lagayi aur FASTag ukhaad diya. Lekin upar lage FASTag reader aur pahiyon ke andar lage tyre sensor ki radio ID ne saabit kar diya ki dono jagah ek hi gaadi thi.',
  },
  {
    id: 'vehicle-intelligence',
    label: '6. Vehicle Intelligence',
    labelHi: '6. गाड़ियों का मिलान (16-मिनट गैप)',
    shortLabel: 'Vehicles',
    icon: Car,
    badge: 'Stage 6',
    plainExplanation: 'Stage 6: Reconstructs the 16-minute Canal Lane vehicle swap using acoustic mic sensors and Wi-Fi probes, while clearing Naveen Kumar’s airport cab.',
    plainExplanationHi: 'चरण 6: 16 मिनट के अंधेरे रास्ते के गैप को स्मार्ट-पोल माइक और वाई-फाई सिग्नल से सुलझाता है, और निर्दोष कैब ड्राइवर नवीन कुमार को बाहर करता है।',
    voiceCommentary:
      'Stage 6, Vehicle Intelligence. Between 7:02 PM and 7:18 PM, the suspect hid in Yemlur–Challaghatta Service Lane (Domlur) for sixteen minutes. Chakravyuh uses smart-pole acoustic sensors and apartment gate Wi-Fi logs to pinpoint the stop, while clearing Naveen Kumar’s airport taxi.',
    voiceCommentaryHi:
      'चरण छह, गाड़ियों का मिलान। अपराधी सोलह मिनट तक बिना कैमरे वाली गली में छुपा रहा। चक्रव्यूह ने स्मार्ट-पोल के साउंड सेंसर और गेट के वाई-फाई से उस ठिकाने को पकड़ लिया और निर्दोष टैक्सी ड्राइवर नवीन कुमार को क्लीन चिट दी।',
    voiceCommentaryHinglish:
      'Charan chhah, Gaadiyon ka Milaan. Apradhi solah minute tak bina camere wali gali mein chhupa raha. Chakravyuh ne smart pole ke sound sensor aur gate ke Wi-Fi se us thikane ko pakad liya aur nirdosh taxi driver Naveen Kumar ko clean chit di.',
  },
  {
    id: 'ai-engine',
    label: '7. AI Leads Review',
    labelHi: '7. AI सुराग और मानवीय फैसला',
    shortLabel: 'AI Leads',
    icon: BrainCircuit,
    badge: 'Stage 7',
    plainExplanation: 'Stage 7: Presents 6 explainable leads with all 8 Sovereign Traps, supporting evidence, and contradictory evidence. Zero automated guilt scores.',
    plainExplanationHi: 'चरण 7: इंसानी पुलिस अधिकारी के फैसले के लिए 6 स्पष्ट सुराग (पक्ष और विपक्ष के सबूतों के साथ) दिखाता है। AI कभी खुद किसी को दोषी घोषित नहीं करता।',
    voiceCommentary:
      'Stage 7, A I Investigation Engine. The A I never assigns a guilt score. Instead, it presents six transparent leads combining all eight sovereign government traps alongside contradictory evidence for Inspector Vikram Rao and A C P Meera Nair.',
    voiceCommentaryHi:
      'चरण सात, एआई सुराग और पुलिस निर्णय। यह सिस्टम कभी खुद किसी को अपराधी घोषित नहीं करता। यह आठों सरकारी जालों के सबूत और बचाव के तथ्य इंस्पेक्टर विक्रम राव और एसीपी मीरा नायर के सामने रखता है।',
    voiceCommentaryHinglish:
      'Charan saat, AI Suraag aur Police Nirnay. Yeh system kabhi khud kisi ko apradhi ghoshit nahi karta. Yeh aathon sarkari jaalon ke saboot aur bachaav ke tathya Inspector Vikram Rao aur ACP Meera Nair ke saamne rakhta hai.',
  },
  {
    id: 'reports',
    label: '8. Timeline & PDF Report',
    labelHi: '8. पूरी टाइमलाइन और कोर्ट PDF रिपोर्ट',
    shortLabel: 'Reports',
    icon: FileText,
    badge: 'Stage 8',
    plainExplanation: 'Stage 8: Unified chronological timeline and 15-section court-ready Investigation Report with one-click PDF export.',
    plainExplanationHi: 'चरण 8: शाम 6:30 से रात 10:18 तक की पूरी घटना की टाइमलाइन और कोर्ट में पेश करने योग्य 15-भागों की PDF रिपोर्ट।',
    voiceCommentary:
      'Stage 8, Unified Timeline and Investigation Report. All verified facts, sovereign traps, and exculpatory records for the Aarav Sharma investigation are compiled into a fifteen-section report ready for P D F export.',
    voiceCommentaryHi:
      'चरण आठ, पूरी टाइमलाइन और पीडीएफ रिपोर्ट। शाम साढ़े छह बजे से रात सवा दस बजे तक का हर सबूत पंद्रह भागों की कोर्ट रिपोर्ट में तैयार हो जाता है जिसे एक क्लिक में डाउनलोड किया जा सकता है।',
    voiceCommentaryHinglish:
      'Charan aath, Poori Timeline aur PDF Report. Shaam saadhe chhah baje se raat sawa das baje tak ka har saboot pandrah bhaagon ki court report mein taiyaar ho jaata hai jise ek click mein download kiya ja sakta hai.',
  },
  {
    id: 'relationship-explorer',
    label: 'Relationship Graph',
    labelHi: 'संबंध ग्राफ (Relationship Graph)',
    shortLabel: 'Graph',
    icon: Share2,
    plainExplanation: 'Visual link diagram separating Verified Relationships (Green), AI Suggestions (Amber), and Rejected Links (Red).',
    plainExplanationHi: 'आरव शर्मा, संदिग्ध फोन, कैमरे, गवाह और गाड़ियों के बीच संबंध दिखाने वाला ग्राफ (हरे = पक्के सबूत, पीले = जांच अधीन, लाल = खारिज)।',
    voiceCommentary:
      'Relationship Explorer. This interactive graph shows how Aarav Sharma, corridor phones, cameras, witnesses, and vehicles connect—clearly separating verified facts from unverified leads.',
    voiceCommentaryHi:
      'रिलेशनशिप ग्राफ। यह चित्र दिखाता है कि आरव शर्मा, संदिग्ध फ़ोन, कैमरे और गाड़ियाँ आपस में कैसे जुड़े हैं, और किन निर्दोष लोगों को जांच से बाहर किया गया है।',
    voiceCommentaryHinglish:
      'Relationship Graph. Yeh chitra dikhata hai ki Aarav Sharma, sandigdh phone, camere aur gaadiyan aapas mein kaise jude hain, aur kin nirdosh logon ko jaanch se baahar kiya gaya hai.',
  },
  {
    id: 'digital-evidence',
    label: 'Digital Evidence Vault',
    labelHi: 'डिजिटल सबूत तिजोरी (SHA-256 Vault)',
    shortLabel: 'Vault',
    icon: FileLock2,
    plainExplanation: 'Cryptographic SHA-256 evidence repository preserving original files untouched and logging every chain-of-custody event.',
    plainExplanationHi: 'क्राइम सीन और सरकारी सर्वर से आए हर वीडियो और फाइल को SHA-256 डिजिटल लॉक के साथ सुरक्षित रखने वाली तिजोरी।',
    voiceCommentary:
      'Digital Evidence Vault. Every uploaded file is hashed in the browser. Original files are locked in an immutable vault by Doctor Priya Krishnan while investigators work on derived copies.',
    voiceCommentaryHi:
      'डिजिटल सबूत तिजोरी। यहाँ डॉ. प्रिया कृष्णन हर वीडियो और रिकॉर्ड को SHA-256 डिजिटल लॉक से सील करती हैं ताकि कोर्ट में साबित हो सके कि सबूत से कोई छेड़छाड़ नहीं हुई।',
    voiceCommentaryHinglish:
      'Digital Saboot Tijori. Yahan Doctor Priya Krishnan har video aur record ko SHA-256 digital lock se seal karti hain taaki court mein saabit ho sake ki saboot se koi chhed-chhaad nahi hui.',
  },
  {
    id: 'collaboration',
    label: 'Agency Collaboration',
    labelHi: 'अधिकारियों का समन्वय (Collaboration)',
    shortLabel: 'Agency',
    icon: Users,
    plainExplanation: 'Role-based approval queue between Inspector Vikram Rao, ACP Meera Nair, Dr. Priya Krishnan, and Arjun Hegde.',
    plainExplanationHi: 'इंस्पेक्टर विक्रम राव, एसीपी मीरा नायर, फॉरेंसिक प्रमुख डॉ. प्रिया कृष्णन और सिस्टम एडमिन अर्जुन हेगड़े के बीच अनुमति और समन्वय।',
    voiceCommentary:
      'Agency Collaboration. Switch between Inspector Vikram Rao, A C P Meera Nair, Doctor Priya Krishnan, and System Administrator Arjun Hegde to test supervisory approvals.',
    voiceCommentaryHi:
      'अधिकारियों का समन्वय। यहाँ पुलिस इंस्पेक्टर, एसीपी और फॉरेंसिक अधिकारी एक-दूसरे को जांच के कार्य और मंजूरी भेजते हैं।',
    voiceCommentaryHinglish:
      'Adhikariyon ka Samanvay. Yahan Police Inspector, ACP aur Forensic Adhikari ek doosre ko jaanch ke kaarya aur manzoori bhejte hain.',
  },
  {
    id: 'admin-audit',
    label: 'Audit & Roadmap',
    labelHi: 'ऑडिट लॉग और सरकारी सुरक्षा',
    shortLabel: 'Audit Log',
    icon: ShieldCheck,
    plainExplanation: 'Live tamper-evident session audit log, Simulated vs. Production matrix, and Sovereign Deployment Roadmap.',
    plainExplanationHi: 'सिस्टम में किए गए हर क्लिक का अटूट रिकॉर्ड (Audit Log) ताकि किसी भी नागरिक की निजता का दुरुपयोग न हो सके।',
    voiceCommentary:
      'Administration and Audit. Every click and review decision in this demo is logged in real time, alongside the architectural roadmap for sovereign government deployment.',
    voiceCommentaryHi:
      'ऑडिट लॉग और सुरक्षा। इस सिस्टम में अधिकारी जो भी सर्च या क्लिक करता है उसका पूरा समय और कारण अपने आप दर्ज होता है।',
    voiceCommentaryHinglish:
      'Audit Log aur Suraksha. Is system mein adhikari jo bhi search ya click karta hai uska poora samay aur kaaran apne aap darj hota hai.',
  },
];

const ROLES: UserRole[] = [
  'Investigator',
  'Senior Officer',
  'Forensic Officer',
  'System Administrator',
];

const ROLE_PROFILES: Record<UserRole, { name: string; badgeId: string; unit: string }> = {
  Investigator: { name: 'Inspector Vikram Rao', badgeId: 'INV-BLR-01', unit: 'Special Investigation Team (Demo)' },
  'Senior Officer': { name: 'ACP Meera Nair', badgeId: 'SUP-BLR-04', unit: 'East Division Command (Demo)' },
  'Forensic Officer': { name: 'Dr. Priya Krishnan', badgeId: 'DFIR-BLR-02', unit: 'Digital Evidence Lab (Demo)' },
  'System Administrator': { name: 'Arjun Hegde (SysAdmin)', badgeId: 'ADM-SNT-01', unit: 'Platform Governance Cell' },
};

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    activeModule,
    setActiveModule,
    currentRole,
    setCurrentRole,
    isExecutiveFocusMode,
    setIsExecutiveFocusMode,
    narrationLanguage,
    setNarrationLanguage,
    isAudioEnabled,
    setIsAudioEnabled,
    isSpeaking,
    stopSpeaking,
    cases,
    devices,
    cameras,
    vehicles,
    leads,
    evidenceItems,
    setSelectedCaseId,
    setSelectedDeviceId,
    setSelectedCameraId,
    setSelectedVehicleId,
    setSelectedLeadId,
    isGuidedActive,
    startGuidedInvestigation,
    isPresentationMode,
    togglePresentationMode,
    resetDemoData,
    toasts,
    dismissToast,
  } = useSentinel();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const currentNavMeta = NAV_ITEMS.find((n) => n.id === activeModule) || NAV_ITEMS[0];
  const isHi = narrationLanguage === 'hi';

  const speakCurrentPageGuide = (langOverride?: 'en' | 'hi') => {
    if (langOverride) {
      setNarrationLanguage(langOverride);
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    const useHindi = (langOverride || narrationLanguage) === 'hi';
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice =
      voices.find(
        (v) =>
          v.localService &&
          (v.lang.toLowerCase().startsWith('hi') ||
            v.name.toLowerCase().includes('hindi') ||
            v.name.toLowerCase().includes('hemant') ||
            v.name.toLowerCase().includes('kalpana') ||
            v.name.toLowerCase().includes('swara') ||
            v.name.toLowerCase().includes('madhur'))
      ) ||
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('swara') ||
          v.name.toLowerCase().includes('madhur')
      );
    const englishVoice =
      voices.find((v) => v.localService && (v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Heera') || v.name.includes('Ravi'))) ||
      voices.find((v) => v.localService && v.lang.startsWith('en')) ||
      voices.find((v) => v.lang.includes('en-IN') || v.name.includes('India')) ||
      voices.find((v) => v.lang.startsWith('en'));

    const textToSpeak = useHindi
      ? hindiVoice
        ? currentNavMeta.voiceCommentaryHi
        : currentNavMeta.voiceCommentaryHinglish
      : currentNavMeta.voiceCommentary;

    setTimeout(() => {
      const u = new SpeechSynthesisUtterance(textToSpeak);
      u.rate = 1.0;
      if (useHindi && hindiVoice) {
        u.voice = hindiVoice;
      } else if (englishVoice) {
        u.voice = englishVoice;
      }
      window.speechSynthesis.speak(u);
    }, 50);
  };

  // Instant Global Search across all synthetic entities
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      module: ModuleId;
      onSelect: () => void;
    }> = [];

    cases.forEach((c) => {
      if (c.id.toLowerCase().includes(q) || c.title.toLowerCase().includes(q) || c.incidentLocation.toLowerCase().includes(q)) {
        results.push({
          id: c.id,
          title: `${c.id}: ${c.title}`,
          subtitle: c.incidentLocation,
          category: 'Case',
          module: 'cases',
          onSelect: () => {
            setSelectedCaseId(c.id);
            setActiveModule('cases');
          },
        });
      }
    });

    devices.forEach((d) => {
      if (d.id.toLowerCase().includes(q) || d.label.toLowerCase().includes(q) || d.ownerNote.toLowerCase().includes(q)) {
        results.push({
          id: d.id,
          title: d.label,
          subtitle: `${d.relevanceStatus} • ${d.sectorIds.join(', ')}`,
          category: 'Device',
          module: 'mobile-intelligence',
          onSelect: () => {
            setSelectedDeviceId(d.id);
            setActiveModule('mobile-intelligence');
          },
        });
      }
    });

    cameras.forEach((cam) => {
      if (cam.id.toLowerCase().includes(q) || cam.name.toLowerCase().includes(q) || cam.locationName.toLowerCase().includes(q)) {
        results.push({
          id: cam.id,
          title: `${cam.id} — ${cam.name}`,
          subtitle: `${cam.footageStatus} • ${cam.locationName}`,
          category: 'CCTV Camera',
          module: 'location-intelligence',
          onSelect: () => {
            setSelectedCameraId(cam.id);
            setActiveModule('location-intelligence');
          },
        });
      }
    });

    vehicles.forEach((v) => {
      if (v.id.toLowerCase().includes(q) || v.label.toLowerCase().includes(q) || v.syntheticRegObservation.toLowerCase().includes(q)) {
        results.push({
          id: v.id,
          title: v.label,
          subtitle: `${v.syntheticRegObservation} • ${v.verificationStatus}`,
          category: 'Vehicle',
          module: 'vehicle-intelligence',
          onSelect: () => {
            setSelectedVehicleId(v.id);
            setActiveModule('vehicle-intelligence');
          },
        });
      }
    });

    leads.forEach((l) => {
      if (l.id.toLowerCase().includes(q) || l.title.toLowerCase().includes(q) || l.observationSummary.toLowerCase().includes(q)) {
        results.push({
          id: l.id,
          title: `${l.id}: ${l.title}`,
          subtitle: l.reviewStatus,
          category: 'AI Lead',
          module: 'ai-engine',
          onSelect: () => {
            setSelectedLeadId(l.id);
            setActiveModule('ai-engine');
          },
        });
      }
    });

    evidenceItems.forEach((e) => {
      if (e.id.toLowerCase().includes(q) || e.title.toLowerCase().includes(q) || e.originalFilename.toLowerCase().includes(q)) {
        results.push({
          id: e.id,
          title: `${e.id}: ${e.title}`,
          subtitle: `SHA-256: ${e.sha256Hash.slice(0, 16)}...`,
          category: 'Digital Evidence',
          module: 'digital-evidence',
          onSelect: () => {
            setActiveModule('digital-evidence');
          },
        });
      }
    });

    return results.slice(0, 10);
  }, [searchQuery, cases, devices, cameras, vehicles, leads, evidenceItems, setSelectedCaseId, setActiveModule, setSelectedDeviceId, setSelectedCameraId, setSelectedVehicleId, setSelectedLeadId]);

  const activeProfile = ROLE_PROFILES[currentRole];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* MANDATORY PERSISTENT SYNTHETIC DATA BANNER */}
      <div className="bg-[#0D1829] border-b border-amber-500/30 px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs z-40">
        <div className="flex items-center gap-2 font-mono font-semibold text-amber-300 tracking-wider">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>DEMONSTRATION ENVIRONMENT — SYNTHETIC DATA ONLY</span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400 font-mono">
          <span>Active Scenario: CASE-SNT-2026-0042 (Bengaluru (Indiranagar, Koramangala, Domlur, Marathahalli, Whitefield & Hosur/Kolar/Tumakuru/Mysuru))</span>
          <span>•</span>
          <span className="text-sky-300">🔊 Voice Audio Commentary & Simplified Briefing Mode Available</span>
        </div>
      </div>

      {/* TOP NAVIGATION BAR */}
      <header className="bg-[#0F1624] border-b border-[#22314E] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 z-30">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveModule('command-centre')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-sky-500/20 to-teal-500/20 border border-sky-400/40 flex items-center justify-center shadow-inner group-hover:border-sky-400 transition">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider text-white">
                  PROJECT CHAKRAVYUH (प्रोजेक्ट चक्रव्यूह)
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-300 border border-sky-500/30">
                  v1.0 GOV-DEMO
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Connect Evidence. Discover Relationships. Accelerate Investigations.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search */}
        <div className="relative flex-1 max-w-sm mx-2">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              placeholder="Search DEV-004, CAM-014, VEH-001, LEAD-001..."
              className="w-full bg-[#090D16] border border-[#22314E] focus:border-sky-400 rounded-lg pl-9 pr-8 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown */}
          {showSearchDropdown && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-[#141D2F] border border-sky-500/40 rounded-lg shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">
                  No synthetic records matching “{searchQuery}”
                </div>
              ) : (
                searchResults.map((item) => (
                  <button
                    key={`${item.category}-${item.id}`}
                    onMouseDown={() => {
                      item.onSelect();
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-3.5 py-2.5 hover:bg-sky-500/10 border-b border-slate-800/80 last:border-none flex items-center justify-between gap-2 transition"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white truncate">{item.title}</div>
                      <div className="text-[11px] text-slate-400 truncate">{item.subtitle}</div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-sky-300 shrink-0">
                      {item.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right: Language Switcher, Voice-Guided Demo Buttons (EN / HI), Simplified View Toggle, Role Selector, Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Top-Bar Language Switcher */}
          <div className="flex items-center bg-[#090D16] border border-sky-500/40 rounded-lg p-0.5 gap-0.5">
            <Languages className="w-3.5 h-3.5 text-sky-400 ml-1.5 mr-0.5 shrink-0" />
            <button
              onClick={() => setNarrationLanguage('en')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                narrationLanguage === 'en'
                  ? 'bg-sky-500 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
              title="Switch Demo & Voice to English"
            >
              🇬🇧 EN
            </button>
            <button
              onClick={() => setNarrationLanguage('hi')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                narrationLanguage === 'hi'
                  ? 'bg-amber-500 text-slate-950'
                  : 'text-amber-300 hover:text-white'
              }`}
              title="डेमो और आवाज़ को सरल हिंदी में बदलें (Switch to Hindi)"
            >
              🇮🇳 हिंदी
            </button>
            <button
              onClick={() => setNarrationLanguage('bilingual')}
              className={`px-2 py-1 rounded text-[11px] font-bold transition ${
                narrationLanguage === 'bilingual'
                  ? 'bg-teal-500 text-slate-950'
                  : 'text-teal-300 hover:text-white'
              }`}
              title="Bilingual Mode (English + हिंदी)"
            >
              Both
            </button>
          </div>

          <button
            onClick={() => startGuidedInvestigation(false, true, narrationLanguage)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs shadow-lg shadow-sky-500/15 transition"
          >
            <Volume2 className="w-4 h-4" />
            <span>
              {isHi
                ? '🇮🇳 हिंदी में वॉइस डेमो शुरू करें'
                : 'START VOICE-GUIDED DEMO'}
            </span>
          </button>

          {/* Simplified / Executive View Toggle */}
          <button
            onClick={() => setIsExecutiveFocusMode(!isExecutiveFocusMode)}
            title="Toggle between Simplified Executive View and Full Analyst View"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition ${
              isExecutiveFocusMode
                ? 'bg-emerald-500/15 border-emerald-400/50 text-emerald-300'
                : 'bg-[#141D2F] border-[#22314E] text-slate-300 hover:border-sky-400/50'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">
              {isExecutiveFocusMode ? (isHi ? 'सरल व्यू' : 'Simplified View') : isHi ? 'पूर्ण व्यू' : 'Full View'}
            </span>
          </button>

          <button
            onClick={togglePresentationMode}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${
              isPresentationMode
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-[#141D2F] border-[#22314E] text-slate-200 hover:border-sky-400/50'
            }`}
          >
            <Presentation className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden 2xl:inline">Presentation Mode</span>
          </button>

          {/* Role Selector */}
          <div className="flex items-center bg-[#090D16] border border-[#22314E] rounded-lg px-2 py-1 gap-2">
            <UserCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <select
              aria-label="Select Simulated User Role"
              value={currentRole}
              onChange={(e) => setCurrentRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-sky-300 outline-none cursor-pointer"
            >
              {ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#0F1624] text-slate-100">
                  {ROLE_PROFILES[r].name} ({r})
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications((s) => !s)}
              title="System Alerts & Notifications"
              className="relative p-2 rounded-lg bg-[#141D2F] border border-[#22314E] hover:border-sky-500/40 text-slate-300 hover:text-white transition"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                4
              </span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#141D2F] border border-[#22314E] rounded-xl shadow-2xl p-3 z-50">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <span className="text-xs font-bold text-white">Investigation Alerts (Demo)</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-[11px] text-slate-400 hover:text-white"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div
                    onClick={() => {
                      setActiveModule('ai-engine');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15"
                  >
                    <div className="font-semibold text-amber-300">6 Candidate AI Leads Awaiting Review</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      LEAD-001 & LEAD-002 flagged for priority investigator verification.
                    </div>
                  </div>
                  <div
                    onClick={() => {
                      setActiveModule('location-intelligence');
                      setSelectedCameraId('CAM-008');
                      setShowNotifications(false);
                    }}
                    className="p-2 rounded bg-rose-500/10 border border-rose-500/30 cursor-pointer hover:bg-rose-500/15"
                  >
                    <div className="font-semibold text-rose-300">CAM-008 Coverage Gap — Bus Dashcam Trap Ready</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Smart Pole 08 offline 18:15–19:30; BMTC Route-335E Bus ADAS dashcam recovered at 18:49.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Demo Data to Baseline"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#141D2F] border border-[#22314E] hover:border-rose-500/50 text-slate-300 hover:text-rose-300 text-xs transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* GUIDED PRESENTATION OVERLAY BAR (Visible when Guided Tour or Presentation Mode is active) */}
      <GuidedPresentationBar />

      {/* PERSISTENT PLAIN-LANGUAGE SCREEN GUIDE & AUDIO EXPLAINER (When browsing outside Guided Tour) */}
      {!isGuidedActive && !isPresentationMode && (
        <div className="bg-[#0B1424] border-b border-sky-500/30 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-[11px]">
              {isHi ? 'स्क्रीन गाइड (सरल विवरण)' : 'SCREEN GUIDE'}
            </span>
            <span className="text-slate-200 font-medium">
              {isHi ? currentNavMeta.plainExplanationHi : currentNavMeta.plainExplanation}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => speakCurrentPageGuide('en')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/50 text-sky-200 font-semibold text-xs transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
              <span>🔊 Listen (English)</span>
            </button>
            <button
              onClick={() => speakCurrentPageGuide('hi')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 font-semibold text-xs transition"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              <span>🔊 हिंदी में सुनें</span>
            </button>
            <button
              onClick={stopSpeaking}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-[11px]"
              title="Stop Voice"
            >
              Stop
            </button>
          </div>
        </div>
      )}

      {/* MAIN BODY: LEFT SIDEBAR + WORKSPACE CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        {!isPresentationMode && (
          <aside
            className={`${
              sidebarCollapsed ? 'w-16' : 'w-64'
            } bg-[#0F1624] border-r border-[#22314E] flex flex-col justify-between transition-all duration-200 shrink-0 select-none`}
          >
            <div className="p-2 space-y-1 overflow-y-auto">
              <div className="flex items-center justify-between px-2 py-1.5">
                {!sidebarCollapsed && (
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    {isHi ? '8-चरण जांच प्रवाह (हिंदी / EN)' : '8-Stage Flow & Tools'}
                  </span>
                )}
                <button
                  onClick={() => setSidebarCollapsed((c) => !c)}
                  title={sidebarCollapsed ? 'Expand Navigation' : 'Collapse Navigation'}
                  className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white ml-auto"
                >
                  {sidebarCollapsed ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              </div>

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveModule(item.id)}
                    title={isHi ? item.labelHi : item.label}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-r from-sky-500/20 to-teal-500/10 text-sky-300 border border-sky-500/40 shadow-sm'
                        : 'text-slate-300 hover:bg-[#141D2F] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-sky-400' : 'text-slate-400'
                        }`}
                      />
                      {!sidebarCollapsed && (
                        <span className="truncate">{isHi ? item.labelHi : item.label}</span>
                      )}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded shrink-0 ${
                          isActive
                            ? 'bg-sky-500/30 text-sky-200 font-bold'
                            : 'bg-slate-800/90 text-slate-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom Safeguard Status */}
            {!sidebarCollapsed && (
              <div className="p-3 m-2 rounded-lg bg-[#090D16] border border-[#22314E] text-[11px] space-y-1.5">
                <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span>Investigative Safeguards</span>
                </div>
                <p className="text-slate-400 leading-snug text-[10px]">
                  Human-in-the-loop enforced. No automated guilt scoring, facial recognition, or live tracking.
                </p>
                <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span>Badge: {activeProfile.badgeId}</span>
                  <span className="text-emerald-400">● Audit Active</span>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Quick Module Bar when in Presentation Mode */}
        {isPresentationMode && (
          <div className="bg-[#0F1624] border-r border-[#22314E] w-14 flex flex-col items-center py-3 gap-2 shrink-0">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id)}
                  title={item.label}
                  className={`p-2.5 rounded-lg transition ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-400/50'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        )}

        {/* Active Module Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 max-w-[1920px] mx-auto w-full">
          {children}
        </main>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#141D2F] border border-[#22314E] rounded-xl max-w-md w-full p-5 shadow-2xl">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base mb-2">
              <RotateCcw className="w-5 h-5" />
              <span>Reset Demonstration Environment?</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              This will restore all synthetic cases, CCTV footage requests, extracted video observations, vehicle comparisons, and AI investigative lead statuses back to the initial baseline for{' '}
              <span className="font-mono text-sky-300">CASE-SNT-2026-0042</span>.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs"
              >
                Confirm Reset Demo Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto p-3 rounded-lg border shadow-xl flex items-start gap-2.5 backdrop-blur-md ${
              t.type === 'success'
                ? 'bg-[#0D211D]/95 border-emerald-500/50 text-emerald-100'
                : t.type === 'warning'
                ? 'bg-[#261B0D]/95 border-amber-500/50 text-amber-100'
                : 'bg-[#0F1B2E]/95 border-sky-500/50 text-sky-100'
            }`}
          >
            {t.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : t.type === 'warning' ? (
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            ) : (
              <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold">{t.title}</div>
              <div className="text-[11px] opacity-90 leading-snug mt-0.5">{t.message}</div>
            </div>
            <button
              onClick={() => dismissToast(t.id)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
