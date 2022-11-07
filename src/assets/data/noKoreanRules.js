export const noKoreanRules = [
  value => !!value || '입력 필수 항목입니다.',
  value => {
    const pattern = /^[A-Za-z0-9\s+]*$/
    return pattern.test(value) || '영문과 숫자만 입력하세요'
  },
]
