import moment from 'moment'

export const dateFormat = date => {
  const formatedDate = moment(date).format('YYYY.MM.DD HH:mm:ss')
  if (formatedDate === 'Invalid date') return date
  return formatedDate
}

export const getNowDate = () => {
  return moment().format('YYYY-MM-DD hh:mm:ss')
}
