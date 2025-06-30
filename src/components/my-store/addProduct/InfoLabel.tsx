import React, { FC } from 'react'
import { Info } from './Icon';
import Tooltip from './Tooltip';
import { tooltips } from './Constants';

const InfoLabel: FC<{ label: string; tooltipKey: string; activeTooltip: string | null; setActiveTooltip: (key: string | null) => void; }> = ({ label, tooltipKey, activeTooltip, setActiveTooltip }) => (
    <div className="flex items-center gap-2">
        <h4 className="font-semibold text-gray-700">{label}</h4>
        <div className="relative">
            <button type="button" onClick={() => setActiveTooltip(activeTooltip === tooltipKey ? null : tooltipKey)} className="text-gray-400 hover:text-blue-500">
                <Info />
            </button>
            {activeTooltip === tooltipKey && <Tooltip text={tooltips[tooltipKey]} />}
        </div>
    </div>
);

export default InfoLabel