const authorityData = [
  {
    name: '관리자 포탈 권한 그룹',
    editable: false,
    group: [
      {
        name: '시스템 관리자(최고 관리자)',
        description: '시스템을 관리하는 최고 관리자',
        editable: false,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
          {
            service: '운영관리',
            role: '',
            subItem: [
              {
                name: '이용현황',
                role: 'view',
              },
              {
                name: '가상서버 현황',
                role: 'edit',
              },
              {
                name: '컨테이너 현황',
                role: 'edit',
              },
            ],
          },
        ],
      },
      {
        name: '클라우드 관리자',
        description: '클라우드를 관리하는 관리자',
        editable: false,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
      {
        name: '클라우드 운영자',
        description: '클라우드를 운영하는 운영자',
        editable: false,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
      {
        name: '클라우드 운영자2',
        description: '클라우드를 운영하는 운영자',
        editable: true,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
      {
        name: '청구서 담당자',
        description: '청구서를 담당하는 담당자',
        editable: true,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: '사용자 포탈 권한 그룹',
    editable: false,
    group: [
      {
        name: '대표 관리자',
        description: '사용자 포탈의 대표 관리자',
        editable: false,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
      {
        name: '서비스 그룹 관리자',
        description: '사용자 포탈의 서비스 그룹을 관리하는 관리자',
        editable: false,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
      {
        name: '서비스 그룹 사용자',
        description: '사용자 포탈의 서비스 그룹을 사용하는 사용자',
        editable: false,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
    ],
  },
  {
    name: '계열사공통그룹',
    editable: true,
    group: [
      {
        name: '대표관리자',
        description: '계열사 공통그룹의 대표 관리자',
        editable: true,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
      {
        name: '계열사 관리자',
        description: '계열사를 관리하는 관리자',
        editable: true,
        user: [],
        authority: [
          {
            service: 'Dashboard',
            role: 'view',
          },
          {
            service: '서비스 관리',
            role: '',
            subItem: [
              {
                name: '서비스그룹 관리',
                role: 'view',
              },
              {
                name: '서비스요청 관리',
                role: 'edit',
              },
            ],
          },
        ],
      },
    ],
  },
]

export default authorityData
