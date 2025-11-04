import React, { useState } from 'react';
import { Users, MessageCircle, AlertTriangle, ThumbsUp, Share2, Flag, Send, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Language } from '../types';
import { t } from '../utils/translations';
import { toast } from 'sonner@2.0.3';

interface CommunityProps {
  language: Language;
}

interface CommunityPost {
  id: string;
  author: string;
  timestamp: Date;
  content: string;
  category: 'warning' | 'report' | 'question';
  likes: number;
  replies: number;
}

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    author: 'User from Delhi',
    timestamp: new Date(Date.now() - 3600000),
    content: 'Received SMS claiming I won 10 lakh lottery from KBC. They asked for processing fee. Reported to 1930.',
    category: 'warning',
    likes: 24,
    replies: 5,
  },
  {
    id: '2',
    author: 'User from Mumbai',
    timestamp: new Date(Date.now() - 7200000),
    content: 'New scam alert: Fake TRAI SMS asking to link Aadhaar with mobile number. Do not click any links!',
    category: 'warning',
    likes: 45,
    replies: 12,
  },
  {
    id: '3',
    author: 'User from Bangalore',
    timestamp: new Date(Date.now() - 10800000),
    content: 'How to report cyber fraud? What documents are needed?',
    category: 'question',
    likes: 8,
    replies: 3,
  },
];

export function Community({ language }: CommunityProps) {
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts);
  const [newPost, setNewPost] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'warning' | 'report' | 'question'>('warning');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [showReplyDialog, setShowReplyDialog] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [repliedPosts, setRepliedPosts] = useState<Set<string>>(new Set()); // Track which posts we've replied to

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;

    const post: CommunityPost = {
      id: Date.now().toString(),
      author: 'You',
      timestamp: new Date(),
      content: newPost,
      category: selectedCategory,
      likes: 0,
      replies: 0,
    };

    setPosts([post, ...posts]);
    setNewPost('');
    
    toast.success(
      language === 'hi' 
        ? 'पोस्ट सफलतापूर्वक साझा की गई!' 
        : language === 'pa'
        ? 'ਪੋਸਟ ਸਫਲਤਾਪੂਰਵਕ ਸਾਂਝੀ ਕੀਤੀ ਗਈ!'
        : language === 'ta'
        ? 'இடுகை வெற்றிகரமாகப் பகிரப்பட்டது!'
        : language === 'te'
        ? 'పోస్ట్ విజయవంతంగా భాగస్వామ్యం చేయబడింది!'
        : 'Post shared successfully!'
    );
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: likedPosts.has(postId) ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );

    setLikedPosts(prevLiked => {
      const newLiked = new Set(prevLiked);
      if (newLiked.has(postId)) {
        newLiked.delete(postId);
        toast.success(language === 'hi' ? 'लाइक हटा दी गई!' : 'Unliked!');
      } else {
        newLiked.add(postId);
        toast.success(language === 'hi' ? 'लाइक किया गया!' : 'Liked!');
      }
      return newLiked;
    });
  };

  const handleShare = (post: CommunityPost) => {
    const shareText = `${post.content}\n\n- Shared from DigiRakshak Community`;
    
    if (navigator.share) {
      navigator.share({
        title: 'DigiRakshak Alert',
        text: shareText,
      }).then(() => {
        toast.success(language === 'hi' ? 'साझा किया गया!' : 'Shared!');
      }).catch((err) => {
        // Fallback to clipboard if sharing fails or is cancelled
        if (err.name !== 'AbortError') {
          navigator.clipboard.writeText(shareText);
          toast.success(language === 'hi' ? 'क्लिपबोर्ड में कॉपी किया गया!' : 'Copied to clipboard!');
        }
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareText);
      toast.success(language === 'hi' ? 'क्लिपबोर्ड में कॉपी किया गया!' : 'Copied to clipboard!');
    }
  };

  const handleReplyClick = (postId: string) => {
    setShowReplyDialog(postId);
    setReplyText('');
  };

  const handleSubmitReply = () => {
    if (!replyText.trim() || !showReplyDialog) return;
    
    // Check if we've already replied to this post
    if (repliedPosts.has(showReplyDialog)) {
      toast.error(language === 'hi' ? 'आप पहले ही जवाब दे चुके हैं!' : 'You have already replied!');
      return;
    }
    
    // Increment reply count ONLY ONCE
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === showReplyDialog
          ? { ...post, replies: post.replies + 1 }
          : post
      )
    );
    
    // Mark this post as replied to
    setRepliedPosts(prev => new Set(prev).add(showReplyDialog));
    
    // Close dialog and reset
    setShowReplyDialog(null);
    setReplyText('');
    
    toast.success(language === 'hi' ? 'जवाब जोड़ा गया!' : 'Reply added!');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'warning':
        return <AlertTriangle className="w-4 h-4" />;
      case 'report':
        return <Flag className="w-4 h-4" />;
      case 'question':
        return <MessageCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'warning':
        return 'bg-orange-500';
      case 'report':
        return 'bg-red-500';
      case 'question':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Translation keys - add these to translations.ts
  const tr = (key: string) => {
    const translations: Record<string, Record<Language, string>> = {
      communityTitle: {
        en: 'Community',
        hi: 'समुदाय',
        pa: 'ਕਮਿਊਨਿਟੀ',
        ta: 'சமூகம்',
        te: 'కమ్యూనిటీ',
        kn: 'ಸಮುದಾಯ',
        ml: 'സമൂഹം',
        bn: 'সম্প্রদায়',
        gu: 'સમુદાય',
        bho: 'समुदाय',
        hne: 'समुदाय',
      },
      communitySubtitle: {
        en: 'Share experiences and help others stay safe',
        hi: 'अनुभव साझा करें और दूसरों को सुरक्षित रहने में मदद करें',
        pa: 'ਤਜਰਬੇ ਸਾਂਝੇ ਕਰੋ ਅਤੇ ਦੂਜਿਆਂ ਨੂੰ ਸੁਰੱਖਿਅਤ ਰਹਿਣ ਵਿੱਚ ਮਦਦ ਕਰੋ',
        ta: 'அனுபவங்களைப் பகிர்ந்து மற்றவர்களை பாதுகாப்பாக இருக்க உதவுங்கள்',
        te: 'అనుభవాలను పంచుకోండి మరియు ఇతరులకు సురక్షితంగా ఉండేందుకు సహాయపడండి',
        kn: 'ಅನುಭವ���ಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ಇತರರಿಗೆ ಸುರಕ್ಷಿತವಾಗಿ ಇರಲು ಸಹಾಯ ಮಾಡಿ',
        ml: 'അനുഭവങ്ങൾ പങ്കിടുകയും മറ്റുള്ളവരെ സുരക്ഷിതമായി നിലനിർത്താൻ സഹായിക്കുകയും ചെയ്യുക',
        bn: 'অভিজ্ঞতা শেয়ার করুন এবং অন্যদের নিরাপদ থাকতে সাহায্য করুন',
        gu: 'અનુભવો શેર કરો અને અન્યને સુરક્ષિત રહેવામાં મદદ કરો',
        bho: 'अनुभव साझा करीं आ दुसरन के सुरक्षित रहे में मदद करीं',
        hne: 'अनुभव साझा करो अर दुसरां नै सुरक्षित रहण में मदद करो',
      },
      shareWithCommunity: {
        en: 'Share with Community',
        hi: 'समुदाय के साथ साझा करें',
        pa: 'ਕਮਿਊਨਿਟੀ ਨਾਲ ਸਾਂਝਾ ਕਰੋ',
        ta: 'சமூகத்துடன் பகிரவும்',
        te: 'కమ్యూనిటీతో భాగస్వామ్యం చేయండి',
        kn: 'ಸಮುದಾಯದೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ',
        ml: 'സമൂഹവുമായി പങ്കിടുക',
        bn: 'সম্প্রদায়ের সাথে শেয়ার করুন',
        gu: 'સમુદાય સાથે શેર કરો',
        bho: 'समुदाय के साथे साझा करीं',
        hne: 'समुदाय कै साथे साझा करो',
      },
      postPlaceholder: {
        en: 'Share a fraud alert, report, or ask a question...',
        hi: 'धोखाधड़ी चेतावनी, रिपोर्ट साझा करें या प्रश्न पूछें...',
        pa: 'ਧੋਖਾਧੜੀ ਚੇਤਾਵਨੀ, ਰਿਪੋਰਟ ਸਾਂਝੀ ਕਰੋ ਜਾਂ ਸਵਾਲ ਪੁੱਛੋ...',
        ta: 'மோசடி எச்சரிக்கை, அறிக்கை பகிரவும் அல்லது கேள்வி கேட்கவும்...',
        te: 'మోసపు హెచ్చరిక, నివేదిక భాగస్వామ్యం చేయండి లేదా ప్రశ్న అడగండి...',
        kn: 'ವಂಚನೆ ಎಚ್ಚರಿಕೆ, ವರದಿ ಹಂಚಿಕೊಳ್ಳಿ ಅಥವಾ ಪ್ರಶ್ನೆ ಕೇಳಿ...',
        ml: 'തട്ടിപ്പ് മുന്നറിയിപ്പ്, റിപ്പോർട്ട് പങ്കിടുക അല്ലെങ്കിൽ ചോദ്യം ചോദിക്കുക...',
        bn: 'প্রতারণা সতর্কতা, রিপোর্ট শেয়ার করুন বা প্রশ্ন জিজ্ঞাসা করুন...',
        gu: 'છેતરપિંડી ચેતવણી, રિપોર્ટ શેર કરો અથવા પ્રશ્ન પૂછો...',
        bho: 'धोखाधड़ी चेतावनी, रिपोर्ट साझा करीं या सवाल पूछीं...',
        hne: 'धोखाधड़ी चेतावनी, रिपोर्ट साझा करो या सवाल पूछो...',
      },
      categoryLabel: {
        en: 'Category',
        hi: 'श्रेणी',
        pa: 'ਸ਼੍ਰੇਣੀ',
        ta: 'வகை',
        te: 'వర్గం',
        kn: 'ವರ್ಗ',
        ml: 'വിഭാഗം',
        bn: 'বিভাগ',
        gu: 'શ્રેણી',
        bho: 'श्रेणी',
        hne: 'श्रेणी',
      },
      warningCategory: {
        en: 'Warning',
        hi: 'चेतावनी',
        pa: 'ਚੇਤਾਵਨੀ',
        ta: 'எச்சரிக்கை',
        te: 'హెచ్చరిక',
        kn: 'ಎಚ್ಚರಿಕೆ',
        ml: 'മുന്നറിയിപ്പ്',
        bn: 'সতর্কবার্তা',
        gu: 'ચેતવણી',
        bho: 'चेतावनी',
        hne: 'चेतावनी',
      },
      reportCategory: {
        en: 'Report',
        hi: 'रिपोर्ट',
        pa: 'ਰਿਪੋਰਟ',
        ta: 'அறிக்கை',
        te: 'నివేదిక',
        kn: 'ವರದಿ',
        ml: 'റിപ്പോർട്ട്',
        bn: 'রিপোর্ট',
        gu: 'રિપોર્ટ',
        bho: 'रिपोर्ट',
        hne: 'रिपोर्ट',
      },
      questionCategory: {
        en: 'Question',
        hi: 'प्रश्न',
        pa: 'ਸਵਾਲ',
        ta: 'கேள்வி',
        te: 'ప్రశ్న',
        kn: 'ಪ್ರಶ್ನೆ',
        ml: 'ചോദ്യം',
        bn: 'প্রশ্ন',
        gu: 'પ્રશ્ન',
        bho: 'सवाल',
        hne: 'सवाल',
      },
      postButton: {
        en: 'Post',
        hi: 'पोस्ट करें',
        pa: 'ਪੋਸਟ ਕਰੋ',
        ta: 'இடுகையிடு',
        te: 'పోస్ట్ చేయండి',
        kn: 'ಪೋಸ್ಟ್ ಮಾಡಿ',
        ml: 'പോസ്റ്റ് ചെയ്യുക',
        bn: 'পোস্ট করুন',
        gu: 'પોસ્ટ કરો',
        bho: 'पोस्ट करीं',
        hne: 'पोस्ट करो',
      },
      allPosts: {
        en: 'All Posts',
        hi: 'सभी पोस्ट',
        pa: 'ਸਾਰੀਆਂ ਪੋਸਟਾਂ',
        ta: 'அனைத்து இடுகைகள்',
        te: 'అన్ని పోస్ట్‌లు',
        kn: 'ಎಲ್ಲಾ ಪೋಸ್ಟ್‌ಗಳು',
        ml: 'എല്ലാ പോസ്റ്റുകളും',
        bn: 'সব পোস্ট',
        gu: 'બધી પોસ્ટ્સ',
        bho: 'सब पोस्ट',
        hne: 'सारी पोस्ट',
      },
      warnings: {
        en: 'Warnings',
        hi: 'चेतावनियाँ',
        pa: 'ਚੇਤਾਵਨੀਆਂ',
        ta: 'எச்சரிக்கைகள்',
        te: 'హెచ్చరికలు',
        kn: 'ಎಚ್ಚರಿಕೆಗಳು',
        ml: 'മുന്നറിയിപ്പുകൾ',
        bn: 'সতর্কবার্তা',
        gu: 'ચેતવણીઓ',
        bho: 'चेतावनी सब',
        hne: 'चेतावनी',
      },
      reports: {
        en: 'Reports',
        hi: 'रिपोर्ट',
        pa: 'ਰਿਪੋਰਟਾਂ',
        ta: 'அறிக்கைகள்',
        te: 'నివేదికలు',
        kn: 'ವರದಿಗಳು',
        ml: 'റിപ്പോർട്ടുകൾ',
        bn: 'রিপোর্ট',
        gu: 'રિપોર્ટ્સ',
        bho: 'रिपोर्ट सब',
        hne: 'रिपोर्ट',
      },
      questions: {
        en: 'Questions',
        hi: 'प्रश्न',
        pa: 'ਸਵਾਲ',
        ta: 'கேள்விகள்',
        te: 'ప్రశ్నలు',
        kn: 'ಪ್ರಶ್ನೆಗಳು',
        ml: 'ചോദ്യങ്ങൾ',
        bn: 'প্রশ্ন',
        gu: 'પ્રશ્નો',
        bho: 'सवाल सब',
        hne: 'सवाल',
      },
      likes: {
        en: 'likes',
        hi: 'लाइक',
        pa: 'ਲਾਈਕਾਂ',
        ta: 'விருப்பங்கள்',
        te: 'ఇష్ట��లు',
        kn: 'ಇಷ್ಟಗಳು',
        ml: 'ഇഷ്ടങ്ങൾ',
        bn: 'লাইক',
        gu: 'લાઈક્સ',
        bho: 'लाइक',
        hne: 'लाइक',
      },
      replies: {
        en: 'replies',
        hi: 'जवाब',
        pa: 'ਜਵਾਬ',
        ta: 'பதில்கள்',
        te: 'సమాధానాలు',
        kn: 'ಉತ್ತರಗಳು',
        ml: 'മറുപടികൾ',
        bn: 'উত্তর',
        gu: 'જવાબો',
        bho: 'जवाब',
        hne: 'जवाब',
      },
      like: {
        en: 'Like',
        hi: 'लाइक',
        pa: 'ਲਾਈਕ',
        ta: 'விருப்பம்',
        te: 'ఇష్టం',
        kn: 'ಇಷ್ಟ',
        ml: 'ഇഷ്ടം',
        bn: 'লাইক',
        gu: 'લાઈક',
        bho: 'लाइक',
        hne: 'लाइक',
      },
      reply: {
        en: 'Reply',
        hi: 'जवाब',
        pa: 'ਜਵਾਬ',
        ta: 'பதில்',
        te: 'సమాధానం',
        kn: 'ಉತ್ತರ',
        ml: 'മറുപടി',
        bn: 'উত্তর',
        gu: 'જવાબ',
        bho: 'जवाब',
        hne: 'जवाब',
      },
      share: {
        en: 'Share',
        hi: 'साझा करें',
        pa: 'ਸਾਂਝਾ ਕਰੋ',
        ta: 'பகிர்',
        te: 'భాగస్వామ్యం',
        kn: 'ಹಂಚಿಕೊಳ್ಳಿ',
        ml: 'പങ്കിടുക',
        bn: 'শেয়ার',
        gu: 'શેર',
        bho: 'साझा करीं',
        hne: 'साझा करो',
      },
      typeReply: {
        en: 'Type your reply...',
        hi: 'अपना जवाब टाइप करें...',
        pa: 'ਆਪਣਾ ਜਵਾਬ ਟਾਈਪ ਕਰੋ...',
        ta: 'உங்கள் பதிலை தட்டச்சு செய்யவும்...',
        te: 'మీ సమాధానాన్ని టైప్ చేయండి...',
        kn: 'ನಿಮ್ಮ ಉತ್ತರವನ್ನು ಟೈಪ್ ಮಾಡಿ...',
        ml: 'നിങ്ങളുടെ മറുപടി ടൈപ്പ് ചെയ്യുക...',
        bn: 'আপনার উত্তর টাইপ করুন...',
        gu: 'તમારો જવાબ ટાઇપ કરો...',
        bho: 'आपन जवाब टाइप करीं...',
        hne: 'आपणा जवाब टाइप करो...',
      },
      sendReply: {
        en: 'Send Reply',
        hi: 'जवाब भेजें',
        pa: 'ਜਵਾਬ ਭੇਜੋ',
        ta: 'பதிலை அனுப்பு',
        te: 'సమాధానం పంపండి',
        kn: 'ಉತ್ತರ ಕಳುಹಿಸಿ',
        ml: 'മറുപടി അയയ്ക്കുക',
        bn: 'উত্তর পাঠান',
        gu: 'જવાબ મોકલો',
        bho: 'जवाब भेजीं',
        hne: 'जवाब भेजो',
      },
      cancel: {
        en: 'Cancel',
        hi: 'रद्द करें',
        pa: 'ਰੱਦ ਕਰੋ',
        ta: 'ரத்துசெய்',
        te: 'రద్దు చేయండి',
        kn: 'ರದ್ದುಮಾಡಿ',
        ml: 'റദ്ദാക്കുക',
        bn: 'বাতিল',
        gu: 'રદ કરો',
        bho: 'रद्द करीं',
        hne: 'रद्द करो',
      },
    };
    
    return translations[key]?.[language] || translations[key]?.['en'] || key;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Users className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2>{tr('communityTitle')}</h2>
            <p className="text-sm text-muted-foreground">{tr('communitySubtitle')}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {/* New Post Card */}
          <Card className="p-4">
            <h3 className="mb-3">{tr('shareWithCommunity')}</h3>
            <Textarea
              placeholder={tr('postPlaceholder')}
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-[100px] mb-3"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm">{tr('categoryLabel')}:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as 'warning' | 'report' | 'question')}
                  className="px-3 py-2 text-sm border rounded-lg bg-background"
                >
                  <option value="warning">{tr('warningCategory')}</option>
                  <option value="report">{tr('reportCategory')}</option>
                  <option value="question">{tr('questionCategory')}</option>
                </select>
              </div>
              <Button onClick={handlePostSubmit} disabled={!newPost.trim()}>
                {tr('postButton')}
              </Button>
            </div>
          </Card>

          {/* Posts Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">{tr('allPosts')}</TabsTrigger>
              <TabsTrigger value="warning">{tr('warnings')}</TabsTrigger>
              <TabsTrigger value="report">{tr('reports')}</TabsTrigger>
              <TabsTrigger value="question">{tr('questions')}</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4 mt-4">
              {posts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${getCategoryColor(post.category)} text-white border-none`}>
                        {getCategoryIcon(post.category)}
                        <span className="ml-1">{tr(`${post.category}Category`)}</span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">{post.author}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {post.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="mb-4">{post.content}</p>
                  
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className={likedPosts.has(post.id) ? 'text-primary' : ''}
                    >
                      <ThumbsUp className={`w-4 h-4 mr-1 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      {post.likes} {tr('likes')}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleReplyClick(post.id)}
                      disabled={repliedPosts.has(post.id)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.replies} {tr('replies')}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post)}
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      {tr('share')}
                    </Button>
                  </div>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="warning" className="space-y-4 mt-4">
              {posts.filter(p => p.category === 'warning').map((post) => (
                <Card key={post.id} className="p-4">
                  {/* Same card structure */}
                  <p>{post.content}</p>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="report" className="space-y-4 mt-4">
              {posts.filter(p => p.category === 'report').map((post) => (
                <Card key={post.id} className="p-4">
                  {/* Same card structure */}
                  <p>{post.content}</p>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="question" className="space-y-4 mt-4">
              {posts.filter(p => p.category === 'question').map((post) => (
                <Card key={post.id} className="p-4">
                  {/* Same card structure */}
                  <p>{post.content}</p>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Reply Dialog */}
      {showReplyDialog && (
        <Dialog open={!!showReplyDialog} onOpenChange={() => setShowReplyDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{tr('reply')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={tr('typeReply')}
                className="min-h-[100px]"
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowReplyDialog(null);
                    setReplyText('');
                  }}
                >
                  {tr('cancel')}
                </Button>
                <Button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim()}
                >
                  {tr('sendReply')}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
