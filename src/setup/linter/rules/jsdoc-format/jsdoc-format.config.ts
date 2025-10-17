export const SERIES = ['property', 'type', 'name', 'emoji', 'description'];
export const EMOJIS = ['➡️', '🎯', '📤'];

const createMSG = (
    // items: any,
    key: string,
    message: string,
    name: string,
    custom?: string
) => {
    const suffixKey = name.charAt(0).toUpperCase() + name.slice(1);
    const newMessage = `🧹 ${message.replace('{name}', name).replace('{custom}', custom || '')}`;
    // emptyNameParam: '🧹 Each @param tag should contain a parameter name.',
    const result = {};
    const newKey = `${key}${suffixKey}`;
    result[newKey] = newMessage;
    return result;
    //     '🧹 The @returns tag should not be empty and should contain a description.',
};

export const messages = {
    missingSummaryEmoji: '🧹 Summary line should include "🎯".',
    missingDoc4ExportedFunction:
        '🧹 Exported function should have a JSDoc block (/** ... */) 🎯',
    missDoc4ExportedConstFunction:
        '🧹 Exported const function should have a JSDoc block (/** ... */) 🎯',
        ... createMSG('emptyName', 'Each @{name} tag should contain a parameter {custom}.', 'param'),
        // ... createMSG('emptyName', 'Each @{name} tag should contain a parameter {custom}.', 'returns'),

        ... createMSG('missingEmoji', 'Each @{name} line should include "{custom}".', 'param', '➡️'),
        ... createMSG('missingEmoji', 'The @{name} line should include "{custom}".', 'returns', '📤'),

        ... createMSG('missingType', 'Each @{name} tag should contain a {type} block.', 'param', ''),
        ... createMSG('missingType', 'Each @{name} tag should contain a {type} block.', 'returns', ''),

        ... createMSG('emptyDescription', 'Each @{name} tag should contain a non-empty description.', 'param'),
        ... createMSG('emptyDescription', 'The @{name} tag should contain a non-empty description.', 'returns'),
} as const;

// export const MESSAGES as const;

console.log(messages);