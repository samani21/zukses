import React from 'react';
import { CheckCircle } from 'lucide-react';
import ProductNav from './ProductNav';
import { TipsChecklist, ValidationStatus } from 'types/product';
// Komponen kecil yang hanya digunakan di sini bisa didefinisikan di file yang sama
const IconLabel = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center space-x-2 text-sm text-gray-600">
    {icon}
    <span>{text}</span>
  </div>
);

const InfoCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-[10px] shadow-sm border border-[#DDDDDD] w-[236px]">
    {
      title === "Rekomendasi" &&
      <div className='h-[38px] flex items-center '>
        <h3 className="font-bold text-white text-[16px] rounded-tr-[10px] rounded-tl-[10px] py-2 px-4 bg-[#00AA5B] w-full h-full">{title}</h3>
      </div>
    }
    <div className="space-y-2 p-4 text-[#333333] text-[14px]">
      {children}
    </div>
  </div >
);

interface SidebarProps {
  tipsChecklist: TipsChecklist;
  activeSection: string;
  onNavigate: (id: string) => void;
  validationStatus: ValidationStatus;
}

const Sidebar = ({ tipsChecklist, activeSection, onNavigate, validationStatus }: SidebarProps) => {
  return (
    <aside className="lg:col-span-1 space-y-6 sticky  pr-2">
      <InfoCard title="Rekomendasi">
        {Object.entries(tipsChecklist).map(([label, isDone]) => (
          <IconLabel
            key={label}
            icon={
              isDone
                ? <CheckCircle className="w-4 h-4 text-green-500" />
                : <CheckCircle className="w-4 h-5 text-[#000000]" />
            }
            text={label}
          />
        ))}
      </InfoCard>

      <ProductNav
        activeSection={activeSection}
        onNavigate={onNavigate}
        validationStatus={validationStatus}
      />

      {/* <TipsCard /> */}
    </aside>
  );
};

export default Sidebar;