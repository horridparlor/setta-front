export type PromptValues = {
  backgroundDescription: string;
  backgroundType: string;
  characterName: string;
  race: string;
  gender: string;
  age: string;
  who: string;
  charactertype: string;
  appearance: string;
  tool: string;
  inherited_tool: boolean;
  action: string;
  effect: string;
  sideCharacterName?: string;
  sideCharacterAppearance?: string;
  sideCharacterType?: string;
  sideCharacter2Name?: string;
  sideCharacter2Appearance?: string;
  sideCharacter2Type?: string;
};

export type PromptGeneratorVariant = 'open' | 'property-list';

export function generatePrompt({
  values,
  variant,
}: {
  values: PromptValues;
  variant: PromptGeneratorVariant;
}) {
  if (variant === 'open') {
    return generateOpenPrompt(values);
  }
  return generatePropertyListPrompt(values);
}

// Prompt generator 1
function generateOpenPrompt(values: PromptValues) {
  let prompt =
    'Create a playing card art image with the following information.\n\n';

  if (values.backgroundType) {
    prompt += `The character is in an ${values.backgroundType} environment.\n`;
  }

  if (values.backgroundDescription) {
    prompt += `The background looks like ${values.backgroundDescription}.\n`;
  }

  if (values.who) {
    prompt += `The main character is ${values.who}.\n`;
  }

  if (values.age) {
    prompt += `Age is ${values.age}.\n`;
  }

  if (values.gender) {
    prompt += `Gender is ${values.gender}.\n`;
  }

  if (values.race) {
    prompt += `Race is ${values.race}.\n`;
  }

  if (values.appearance) {
    prompt += `The character looks like ${values.appearance}.\n`;
  }

  if (values.tool) {
    prompt += `They are holding ${values.tool}.\n`;
  }

  if (values.action) {
    prompt += `They are currently ${values.action}.\n`;
  }

  if (values.sideCharacterType) {
    prompt += `There is a side character ${values.sideCharacterType}.\n`;
  }

  if (values.sideCharacterAppearance) {
    prompt += `The side character looks like ${values.sideCharacterAppearance}.\n`;
  }

  if (values.effect) {
    prompt += `The image should have the following special effect: ${values.effect}`;
  }

  return prompt;
}

// Prompt generator 2
function generatePropertyListPrompt(values: PromptValues) {
  let prompt =
    'The following properties describe the art image of a playing card. Generate a new art image using these attributes:\n\n';

  prompt += `BackgroundType: ${values.backgroundType || 'N/A'}
BackgroundDescription: ${values.backgroundDescription || 'N/A'}
CharacterType: ${values.charactertype || 'N/A'}
Race: ${values.race || 'N/A'}
Gender: ${values.gender || 'N/A'}
Age: ${values.age || 'N/A'}
Appearance: ${values.appearance || 'N/A'}
Tool: ${values.tool || 'N/A'}
InheritedTool: ${values.inherited_tool ? 'Yes' : 'No'}
Action: ${values.action || 'N/A'}
Effect: ${values.effect || 'N/A'}
SideCharacterType: ${values.sideCharacterType || 'N/A'}
SideCharacterAppearance: ${values.sideCharacter2Appearance || 'N/A'}
  `;

  return prompt;
}
