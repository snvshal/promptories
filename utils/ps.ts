export const ps = (obj: object) => JSON.parse(JSON.stringify(obj));

export const isValidPromptoryId = (promptory_id: string): boolean => {
  if (!promptory_id) return false;

  const idAsNumber = Number(promptory_id);
  if (isNaN(idAsNumber)) return false;

  const currentTimestamp = Date.now();
  const earliestValidTimestamp = new Date("1970-01-01").getTime();

  // Check if the ID falls within valid timestamp range
  return idAsNumber >= earliestValidTimestamp && idAsNumber <= currentTimestamp;
};
