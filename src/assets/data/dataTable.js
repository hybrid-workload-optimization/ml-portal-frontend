const DataTable = {
  headers: [
    {
      text: '요청구분',
      align: '',
      value: 'name',
      class: 'w-10',
    },
    {
      text: '관리번호',
      align: '',
      value: 'mngNo',
      class: 'w-10',
    },
    {
      text: '서비스그룹명',
      align: '',
      value: 'groupName',
      class: 'w-10',
    },
    {
      text: '요약',
      align: '',
      value: 'summary',
      class: 'w-10',
    },
    {
      text: '요청자',
      align: '',
      value: 'requester',
      class: 'w-10',
    },
    {
      text: '처리자',
      align: '',
      value: 'manager',
      class: 'w-10',
    },
    {
      text: '요청일시',
      align: '',
      value: 'requestDate',
      class: 'w-10',
    },
    {
      text: '처리일시',
      align: '',
      value: 'managedDate',
      class: 'w-10',
    },
    {
      text: '상태',
      align: '',
      value: 'status',
      class: 'w-10',
    },
    {
      text: '관리',
      align: '',
      value: 'management',
      class: 'w-10',
    },
  ],
  options: {
    hideFooter: true,
    hideHeader: false,
    dark: false,
    dense: true,
    disableFiltering: false,
    disablePagination: false,
    disableSort: false,
    fixedHeader: false,
    showSelect: true,
    itemKey: 'mngNo',
  },
  group: [
    {
      name: '서비스그룹 신청1',
      mngNo: '시스템운영부',
      groupName: '재난지원금 조회1',
      summary: 'WAS VM 생성 요청',
      requester: '홍길동',
      manager: '홍길순',
      requestDate: '2022-12-30',
      managedDate: '2022-12-30',
      status: '승인대기',
      management: '요약',
    },
    {
      name: '서비스그룹 신청2',
      mngNo: 'SR20210101-002',
      groupName: '재난지원금 조회1',
      summary: 'WAS VM 생성 요청',
      requester: '홍길동',
      manager: '홍길순',
      requestDate: '2022-12-30',
      managedDate: '2022-12-30',
      status: '승인대기',
      management: '요약',
    },
    {
      name: '서비스그룹 신청3',
      mngNo: 'SR20210101-003',
      groupName: '재난지원금 조회1',
      summary: 'WAS VM 생성 요청',
      requester: '홍길동',
      manager: '홍길순',
      requestDate: '2022-12-30',
      managedDate: '2022-12-30',
      status: '승인대기',
      management: '요약',
    },
    {
      name: '서비스그룹 신청4',
      mngNo: 'SR20210101-004',
      groupName: '재난지원금 조회1',
      summary: 'WAS VM 생성 요청',
      requester: '홍길동',
      manager: '홍길순',
      requestDate: '2022-12-30',
      managedDate: '2022-12-30',
      status: '승인대기',
      management: '요약',
    },
    {
      name: '서비스그룹 신청5번은 15글자를 넘겨서 말줄임표가 들어가 마우스 오버시 툴팁이 생겨납니다.',
      mngNo: 'SR20210101-005SR20210101-005SR20210101-005',
      groupName: '재난지원금 조회1SR20210101-005',
      summary: 'WAS VM 생성 요청SR20210101-005',
      requester: '홍길동SR20210101-005',
      manager: '홍길순SR20210101-005',
      requestDate: '2022-12-30SR20210101-005',
      managedDate: '2022-12-30SR20210101-005',
      status: '승인대기',
      management: '요약',
    },
  ],
  customSlotInfo: [
    { name: 'status', slotName: 'status' },
    { name: 'management', slotName: 'management' },
  ],
}

export default DataTable
