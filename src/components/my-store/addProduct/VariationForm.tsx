import React from 'react';

interface Variation {
    name: string;
    options: string[];
}

interface VariationFormProps {
    variation: Variation;
    index: number;
    updateVariation: (index: number, updated: Variation) => void;
}

const VariationForm = React.memo(({ variation, index, updateVariation }: VariationFormProps) => {
    const handleNameChange = (value: string) => {
        updateVariation(index, { ...variation, name: value });
    };

    const handleOptionChange = (optIndex: number, value: string) => {
        const newOptions = [...variation.options];
        newOptions[optIndex] = value;

        // Logic auto-add empty & remove double empty
        if (optIndex === newOptions.length - 1 && value.trim() !== '') {
            newOptions.push('');
        }
        if (newOptions.length >= 2 && newOptions.slice(-2).every(opt => opt.trim() === '')) {
            newOptions.pop();
        }

        updateVariation(index, { ...variation, options: newOptions });
    };

    return (
        <div>
            <input
                type="text"
                value={variation.name}
                onChange={(e) => handleNameChange(e.target.value)}
            />
            {variation.options.map((opt, i) => (
                <input
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                />
            ))}
        </div>
    );
});

VariationForm.displayName = 'VariationForm';

export default VariationForm;
