export const validate = {
  required: [
    value =>
      (value !== null && value !== undefined && value !== '') ||
      '값을 입력해 주세요.',
  ],
  requiredEmail: [
    value => !!value || '이메일을 입력하세요.',
    value =>
      /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
      '이메일 형식이 올바르지 않습니다.',
  ],
  requiredPw: [
    value => !!value || '비밀번호를 입력하세요.',
    value => value?.length >= 6 || '비밀번호는 6자 이상이어야 합니다.',
    value => value?.length <= 20 || '비밀번호는 20자 이하이어야 합니다.',
    value => /[a-z]/.test(value) || '비밀번호는 영문자를 포함해야 합니다.',
    value => /[0-9]/.test(value) || '비밀번호는 숫자를 포함해야 합니다.',
    /* value =>
      /[!@#$%^&*()_+\-=[\][\]{};':"\\|,.<>[\]/?]/.test(value) ||
      '비밀번호는 특수문자를 포함해야 합니다.', */
  ],
  requiredAddonPw: [
    value => !!value || '비밀번호를 입력하세요.',
    value => value?.length >= 5 || '비밀번호는 5자 이상이어야 합니다.',
    value => value?.length <= 20 || '비밀번호는 20자 이하이어야 합니다.',
  ],
  // requiredPwConfirm: [
  //   value => !!value || '비밀번호 확인을 입력하세요',
  //   value => value === this?.password || '비밀번호가 일치하지 않습니다.',
  //   value => value?.length >= 6 || '비밀번호는 6자 이상이어야 합니다.',
  //   value => value?.length <= 20 || '비밀번호는 20자 이하이어야 합니다.',
  //   value => /[a-z]/.test(value) || '비밀번호는 영문자를 포함해야 합니다.',
  //   value => /[0-9]/.test(value) || '비밀번호는 숫자를 포함해야 합니다.',
  //   value =>
  //     /[!@#$%^&*()_+\-=[\][\]{};':"\\|,.<>[\]/?]/.test(value) ||
  //     '비밀번호는 특수문자를 포함해야 합니다.',
  // ],
  requiredName: [
    value => !!value || '이름을 입력하세요.',
    value => value?.length <= 20 || '이름은 20자 이하이어야 합니다.',
    value =>
      /^[가-힣A-Za-z0-9]*$/.test(value) ||
      '이름은 한글,영어,숫자만 입력하세요.',
  ],
  requiredUserID: [
    value => !!value || 'ID를 입력하세요.',
    value => /^[A-Za-z0-9]*$/.test(value) || 'ID는 영어,숫자만 입력하세요.',
  ],
  // requiredOrganization: [value => !!value || '소속을 입력하세요.'],
  requiredContact: [
    // value => !!value || '연락처를 입력하세요.',
    value => /^\d*$/.test(value) || '연락처는 숫자만 입력하세요.',
    value => value?.length < 12 || '연락처는 12자리를 미만으로 입력가능합니다.',
    // value => value?.length === 11 || '연락처는 11자리를 입력하세요',
    value =>
      value
        ? /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/.test(value) ||
          '연락처 형식이 올바르지 않습니다.'
        : true,
  ],
  requiredLabelKey: [
    value => !!value || '키를 입력하세요.',
    value => value?.length <= 20 || '키는 20자 이하이어야 합니다.',
  ],
  requiredLabelValue: [
    value => !!value || '값을 입력하세요.',
    value => value?.length <= 20 || '값은 20자 이하이어야 합니다.',
  ],
  validateNumber: [
    value => !!value || '값을 입력하세요',
    value => /^[0-9]+$/.test(value) || '숫자만 입력 가능 합니다.',
  ],
  validatePortNumer: [
    value => !!value || '값을 입력하세요',
    value => /^[0-9]+$/.test(value) || '숫자만 입력 가능 합니다.',
    value =>
      (value > 29999 && value < 32768) ||
      '30000-32767 범위의 숫자만 입력 가능 합니다.',
  ],
  validateIpAddress: [
    value => !!value || '값을 입력하세요.',
    value =>
      /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(
        value,
      ) || 'IP 형식에 맞춰주시기 바랍니다.',
  ],
}
