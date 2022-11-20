export interface InputComponent<Value = string> {
  value: () => Value
  showErrorText: (errorText: string) => void
  clearErrorText: () => void
}
