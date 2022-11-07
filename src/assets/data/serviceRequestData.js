import { uuid } from 'vue-uuid'

export const ServiceRequestData = {
  table: {
    todos: {
      headers: [
        {
          text: '요청구분',
          align: 'center',
          value: 'category',
        },
        {
          text: '관리번호',
          align: 'center',
          value: 'mngNo',
        },
        {
          text: '서비스그룹명',
          align: 'center',
          value: 'groupName',
        },
        {
          text: '요약',
          align: 'center',
          value: 'summary',
        },
        {
          text: '요청자',
          align: 'center',
          value: 'requester',
        },
        {
          text: '처리자',
          align: 'center',
          value: 'manager',
        },
        {
          text: '요청일시',
          align: 'center',
          value: 'requestDate',
        },
        {
          text: '처리일시',
          align: 'center',
          value: 'managedDate',
        },
        {
          text: '상태',
          align: 'center',
          value: 'status',
        },
        {
          text: '관리',
          align: 'center',
          value: 'management',
        },
      ],
      options: {
        hideFooter: true,
        hideHeader: false,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: false,
        showSelect: true,
        itemKey: 'mngNo',
      },
      group: [
        {
          category: '서비스그룹 신청1',
          mngNo: '시스템운영부',
          groupName: '재난지원금 조회1',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '승인대기',
          management: '요약',
        },
        {
          category: '서비스그룹 신청2',
          mngNo: 'SR20210101-002',
          groupName: '재난지원금 조회1',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '승인대기',
          management: '요약',
        },
        {
          category: '서비스그룹 신청3',
          mngNo: 'SR20210101-003',
          groupName: '재난지원금 조회1',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '승인대기',
          management: '요약',
        },
        {
          category: '서비스그룹 신청4',
          mngNo: 'SR20210101-004',
          groupName: '재난지원금 조회1',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '승인대기',
          management: '요약',
        },
        {
          category: '서비스그룹 신청5',
          mngNo: 'SR20210101-005',
          groupName: '재난지원금 조회1',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '승인대기',
          management: '요약',
        },
      ],
      customSlotInfo: [
        { name: 'status', slotName: 'status' },
        { name: 'management', slotName: 'management' },
      ],
    },
    history: {
      headers: [
        {
          text: '요청구분',
          align: 'center',
          value: 'category',
        },
        {
          text: '관리번호',
          align: 'center',
          value: 'mngNo',
        },
        {
          text: '서비스그룹명',
          align: 'center',
          value: 'groupName',
        },
        {
          text: '요약',
          align: 'center',
          value: 'summary',
        },
        {
          text: '요청자',
          align: 'center',
          value: 'requester',
        },
        {
          text: '처리자',
          align: 'center',
          value: 'manager',
        },
        {
          text: '요청일시',
          align: 'center',
          value: 'requestDate',
        },
        {
          text: '처리일시',
          align: 'center',
          value: 'managedDate',
        },
        {
          text: '상태',
          align: 'center',
          value: 'status',
        },
        {
          text: '관리',
          align: 'center',
          value: 'management',
        },
      ],
      options: {
        hideFooter: false,
        hideHeader: false,
        dark: false,
        dense: false,
        disableFiltering: false,
        disablePagination: false,
        disableSort: false,
        fixedHeader: false,
      },
      group: [
        {
          category: '서비스그룹 신청',
          mngNo: 'SR20210101-001',
          groupName: '재난지원금 조회1',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '지원구성정보요청',
          management: '요약',
        },
        {
          category: '서비스그룹 신청',
          mngNo: 'SR20210101-001',
          groupName: '재난지원금 조회2',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '반려',
          management: '요약',
        },
        {
          category: '서비스그룹 신청',
          mngNo: 'SR20210101-001',
          groupName: '재난지원금 조회3',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '승인',
          management: '요약',
        },
        {
          category: '서비스그룹 신청',
          mngNo: 'SR20210101-001',
          groupName: '재난지원금 조회4',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '반려',
          management: '요약',
        },
        {
          category: '서비스그룹 신청',
          mngNo: 'SR20210101-001',
          groupName: '재난지원금 조회5',
          summary: 'WAS VM 생성 요청',
          requester: '홍길동',
          manager: '홍길순',
          requestDate: new Date().getDate(),
          managedDate: new Date().getDate(),
          status: '승인',
          management: '요약',
        },
      ],
      customSlotInfo: [
        { name: 'status', slotName: 'status' },
        { name: 'management', slotName: 'management' },
      ],
    },
  },
}

export const ServiceRequestItem = [
  {
    id: 'serviceGroup',
    name: '서비스 그룹',
    imagePath: 'service.svg',
    buttons: [
      { name: '신청', target: 'add' },
      { name: '관리이관', target: 'update' },
      { name: '삭제', target: 'delete' },
    ],
    groupNames: [
      { name: '서비스 그룹 테스트1', target: '' },
      { name: '서비스 그룹 테스트2', target: '' },
      { name: '서비스 그룹 테스트3', target: '' },
    ],
    payInfo: [
      {
        name: '서비스그룹 신청 결재라인',
        target: 'add',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: '서비스승인1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: '서비스승인2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
          {
            id: uuid.v1(),
            name: '서비스승인3',
            requesters: ['홍길동', '김상초'],
          },
        ],
      },
      {
        name: '서비스그룹 관리이관 결재라인',
        target: 'update',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: '서비스관리이관1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: '서비스관리이관2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
          {
            id: uuid.v1(),
            name: '서비스관리이관3',
            requesters: ['홍길동', '김상초'],
          },
        ],
      },
      {
        name: '서비스그룹 삭제 결재라인',
        target: 'delete',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: '서비스삭제1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: '서비스삭제2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
          {
            id: uuid.v1(),
            name: '서비스삭제3',
            requesters: ['홍길동', '김상초'],
          },
        ],
      },
    ],
  },
  {
    id: 'cloud',
    name: '클라우드 자원',
    imagePath: 'cloud.svg',
    buttons: [
      { name: '신청', target: 'add' },
      { name: '변경', target: 'update' },
      { name: '삭제', target: 'delete' },
    ],
    groupNames: [
      { name: '클라우드 자원 테스트1', target: '' },
      { name: '클라우드 자원 테스트2', target: '' },
      { name: '클라우드 자원 테스트3', target: '' },
    ],
    payInfo: [
      {
        name: '클라우드 자원 신청 결재라인',
        target: 'add',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: '클라우드승인1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: '클라우드승인2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
          {
            id: uuid.v1(),
            name: '클라우드승인3',
            requesters: ['홍길동', '김상초'],
          },
          {
            id: uuid.v1(),
            name: '클라우드승인4',
            requesters: ['홍길동'],
          },
        ],
      },
      {
        name: '클라우드 자원 변경 결재라인',
        target: 'update',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: '클라우드변경1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: '클라우드변경2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
          {
            id: uuid.v1(),
            name: '클라우드변경3',
            requesters: ['홍길동', '김상초'],
          },
          {
            id: uuid.v1(),
            name: '클라우드변경4',
            requesters: ['홍길동'],
          },
        ],
      },
      {
        name: '클라우드 자원 삭제 결재라인',
        target: 'delete',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: '클라우드삭제1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: '클라우드삭제2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
          {
            id: uuid.v1(),
            name: '클라우드삭제3',
            requesters: ['홍길동', '김상초'],
          },
          {
            id: uuid.v1(),
            name: '클라우드삭제4',
            requesters: ['홍길동'],
          },
        ],
      },
    ],
  },
  {
    id: 'devOps',
    name: 'DevOps 환경',
    imagePath: 'devops.svg',
    buttons: [
      { name: 'Toolchain 신청', target: 'add' },
      { name: 'Toolchain 변경', target: 'update' },
      { name: 'Toolchain 삭제', target: 'delete' },
    ],
    groupNames: [
      { name: 'devOps 테스트1', target: '' },
      { name: 'devOps 테스트2', target: '' },
      { name: 'devOps 테스트3', target: '' },
    ],
    payInfo: [
      {
        name: 'Toolchain 신청 결재라인',
        target: 'add',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: 'DevOps승인1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: 'DevOps승인2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
        ],
      },
      {
        name: 'Toolchain 변경 결재라인',
        target: 'update',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: 'DevOps변경1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: 'DevOps변경2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
        ],
      },
      {
        name: 'Toolchain 삭제 결재라인',
        target: 'delete',
        payInfoItems: [
          {
            id: uuid.v1(),
            name: '요청',
            requesters: ['홍길동', '김상초', '타노스'],
          },
          {
            id: uuid.v1(),
            name: 'DevOps삭제1',
            requesters: [
              '홍길동',
              '김상초',
              '타노스',
              '아이언',
              '유관순',
              '홍길순',
            ],
          },
          {
            id: uuid.v1(),
            name: 'DevOps삭제2',
            requesters: ['홍길동', '김상초', '타노스', '아이언', '유관순'],
          },
        ],
      },
    ],
  },
]

export const ServiceRequesters = {
  headers: [
    {
      text: '이름',
      align: 'center',
      value: 'name',
      class: 'w-20',
    },
    {
      text: '부서',
      align: 'center',
      value: 'department',
      class: 'w-30',
    },
    {
      text: '권한',
      align: 'center',
      value: 'authority',
      class: 'w-40',
    },
  ],
  options: {
    hideFooter: true,
    hideHeader: false,
    dark: false,
    dense: false,
    disableFiltering: false,
    disablePagination: false,
    disableSort: false,
    fixedHeader: false,
    showSelect: true,
    itemKey: 'id',
  },
  group: [
    {
      id: uuid.v1(),
      name: '서비스그룹 신청5번은 15글자를 넘겨서 말줄임표가 들어가 마우스 오버시 툴팁이 생겨납니다.',
      department: '시스템운영부',
      authority: '서비스 그룹 사용자',
    },
    {
      id: uuid.v1(),
      name: '홍길순',
      department: '정보개발부',
      authority: '서비스 그룹 사용자',
    },
    {
      id: uuid.v1(),
      name: '유관순',
      department: '서비스개발부',
      authority: '서비스 그룹 사용자',
    },
    {
      id: uuid.v1(),
      name: '유관순',
      department: 'IT디지털개발부',
      authority: '서비스 그룹 관리자',
    },
    {
      id: uuid.v1(),
      name: '김상초',
      department: 'IT디지털개발부',
      authority: '서비스 그룹 사용자',
    },
    {
      id: uuid.v1(),
      name: '타노스',
      department: 'IT디지털개발부',
      authority: '서비스 그룹 사용자',
    },
    {
      id: uuid.v1(),
      name: '아이언',
      department: 'IT디지털개발부',
      authority: '서비스 그룹 사용자',
    },
    {
      id: uuid.v1(),
      name: '김동욱',
      department: 'IT서비스개발부',
      authority: '서비스 그룹 관리자',
    },
    {
      id: uuid.v1(),
      name: '강감찬',
      department: 'IT서비스개발부',
      authority: '서비스 그룹 관리자',
    },
    {
      id: uuid.v1(),
      name: '이순신',
      department: '경영지원팀',
      authority: '서비스 그룹 사용자',
    },
    {
      id: uuid.v1(),
      name: '나일권',
      department: 'IT서비스개발부',
      authority: '서비스 그룹 관리자',
    },
  ],
}

export const ServiceRequestProcessLog = {
  logs: {
    headers: [
      {
        text: '구분',
        align: 'center',
        value: 'category',
      },
      {
        text: '처리자',
        align: 'center',
        value: 'taker',
      },
      {
        text: '처리일시',
        align: 'center',
        value: 'date',
      },
      {
        text: '결과',
        align: 'center',
        value: 'result',
      },
    ],
    options: {
      hideFooter: false,
      hideHeader: false,
      dark: false,
      dense: false,
      disableFiltering: false,
      disablePagination: false,
      disableSort: false,
      fixedHeader: false,
    },
    data: [
      {
        category: '승인대기',
        taker: '서동현',
        date: '2021-01-23 12:34:56',
        result: '',
      },
    ],
  },
  vm_list: {
    headers: [
      {
        text: '서버명',
        align: 'center',
        value: 'server_name',
      },
      {
        text: '존',
        align: 'center',
        value: 'zone',
      },
      {
        text: 'OS',
        align: 'center',
        value: 'os',
      },
      {
        text: 'Instance',
        align: 'center',
        value: 'instance',
      },
      {
        text: '호스트',
        align: 'center',
        value: 'host',
      },
      {
        text: 'IP',
        align: 'center',
        value: 'ip',
      },
      {
        text: 'NAS',
        align: 'center',
        value: 'nas',
      },
      {
        text: '스토리지(GB)',
        align: 'center',
        value: 'storage_gb',
      },
      {
        text: '스크립트',
        align: 'center',
        value: 'script',
      },
    ],
    options: {
      hideFooter: false,
      hideHeader: false,
      dark: false,
      dense: false,
      disableFiltering: false,
      disablePagination: false,
      disableSort: false,
      fixedHeader: false,
    },
    data: [],
  },
  storage_list: {
    headers: [
      {
        text: '볼륨명',
        align: 'center',
        value: 'volume_name',
      },
      {
        text: '파일 시스템',
        align: 'center',
        value: 'file_system',
      },
      {
        text: '프로토콜',
        align: 'center',
        value: 'protocol',
      },
      {
        text: '마운트 패스',
        align: 'center',
        value: 'mount_pass',
      },
      {
        text: '연결서버',
        align: 'center',
        value: 'connected_server',
      },
    ],
    options: {
      hideFooter: false,
      hideHeader: false,
      dark: false,
      dense: false,
      disableFiltering: false,
      disablePagination: false,
      disableSort: false,
      fixedHeader: false,
    },
    data: [],
  },
}
