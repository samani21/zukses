import React, { FC } from 'react'

const SectionTitle: FC<{ title: string; required?: boolean; }> = ({ title, required }) => (
    <div className="mb-3">
        <h3 className="text-md font-semibold text-gray-800 flex items-center">
            {title}
            {required && <span className="text-blue-500 ml-1">*</span>}
        </h3>
    </div>
);

export default SectionTitle