import React from 'react';
import { 
  Search, 
  Code, 
  Share2, 
  Mail, 
  Target, 
  Megaphone, 
  Star, 
  MessageSquare, 
  Layers, 
  Award, 
  DollarSign, 
  Zap, 
  TrendingUp, 
  Compass, 
  LayoutGrid, 
  Cpu, 
  Sliders, 
  BarChart3, 
  CheckCircle2, 
  Users, 
  Rocket, 
  Globe, 
  Smile, 
  Store, 
  MapPin, 
  ShoppingBag, 
  Laptop, 
  Activity, 
  Building2, 
  GraduationCap,
  ChevronRight,
  ArrowRight,
  Clock,
  Phone,
  Check,
  X,
  Play,
  Calendar,
  Filter,
  Send,
  ThumbsUp,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface IconRendererProps {
  name: string;
  className?: string;
  size?: number;
}

export const IconRenderer: React.FC<IconRendererProps> = ({ name, className = 'w-5 h-5', size }) => {
  const iconProps = { className, ...(size ? { size } : {}) };

  switch (name) {
    case 'Search': return <Search {...iconProps} />;
    case 'Code': return <Code {...iconProps} />;
    case 'Share2': return <Share2 {...iconProps} />;
    case 'Mail': return <Mail {...iconProps} />;
    case 'Target': return <Target {...iconProps} />;
    case 'Megaphone': return <Megaphone {...iconProps} />;
    case 'Star': return <Star {...iconProps} />;
    case 'MessageSquare': return <MessageSquare {...iconProps} />;
    case 'Layers': return <Layers {...iconProps} />;
    case 'Award': return <Award {...iconProps} />;
    case 'DollarSign': return <DollarSign {...iconProps} />;
    case 'Zap': return <Zap {...iconProps} />;
    case 'TrendingUp': return <TrendingUp {...iconProps} />;
    case 'Compass': return <Compass {...iconProps} />;
    case 'LayoutGrid': return <LayoutGrid {...iconProps} />;
    case 'Cpu': return <Cpu {...iconProps} />;
    case 'Sliders': return <Sliders {...iconProps} />;
    case 'BarChart3': return <BarChart3 {...iconProps} />;
    case 'CheckCircle2': return <CheckCircle2 {...iconProps} />;
    case 'Users': return <Users {...iconProps} />;
    case 'Rocket': return <Rocket {...iconProps} />;
    case 'Globe': return <Globe {...iconProps} />;
    case 'Smile': return <Smile {...iconProps} />;
    case 'Store': return <Store {...iconProps} />;
    case 'MapPin': return <MapPin {...iconProps} />;
    case 'ShoppingBag': return <ShoppingBag {...iconProps} />;
    case 'Laptop': return <Laptop {...iconProps} />;
    case 'Activity': return <Activity {...iconProps} />;
    case 'Building2': return <Building2 {...iconProps} />;
    case 'GraduationCap': return <GraduationCap {...iconProps} />;
    case 'ChevronRight': return <ChevronRight {...iconProps} />;
    case 'ArrowRight': return <ArrowRight {...iconProps} />;
    case 'Clock': return <Clock {...iconProps} />;
    case 'Phone': return <Phone {...iconProps} />;
    case 'Check': return <Check {...iconProps} />;
    case 'X': return <X {...iconProps} />;
    case 'Play': return <Play {...iconProps} />;
    case 'Calendar': return <Calendar {...iconProps} />;
    case 'Filter': return <Filter {...iconProps} />;
    case 'Send': return <Send {...iconProps} />;
    case 'ThumbsUp': return <ThumbsUp {...iconProps} />;
    case 'ExternalLink': return <ExternalLink {...iconProps} />;
    case 'HelpCircle': return <HelpCircle {...iconProps} />;
    case 'ShieldCheck': return <ShieldCheck {...iconProps} />;
    case 'Sparkles': return <Sparkles {...iconProps} />;
    case 'ArrowUpRight': return <ArrowUpRight {...iconProps} />;
    default: return <Sparkles {...iconProps} />;
  }
};
