// dataTable helpers

/*
    @brief Compare two arrays
    @date 2021/11/24
    @return
    @param
        - a: 비교할 배열 a
        - b: 비교할 배열 b
*/

const STATUS = {
  승인요청: '#00BA88',
  서비스중: '#00B8D5',
  승인완료: '#1A3350',
  삭제완료: '#5B6C82',
  승인대기: '#F4B740',
  지원구성정보요청: '#4E4B66',
  반려: '#EA1606',
  승인: '#29AA54',
}
export const getChipColor = status => STATUS[status]
