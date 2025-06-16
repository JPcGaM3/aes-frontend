// Usage examples:
// translateEnumValue(UserRole.Driver, UserRoleTranslation) => "พนักขับรถ"
// translateEnumValue(UserStatus.Working, UserStatusTranslation) => "กำลังทำงาน"
export function translateEnumValue<T extends string>(
  value: T,
  translationMap: Record<string, string>,
): string {
  return translationMap[value] || value;
}
