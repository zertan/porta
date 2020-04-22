/**
 * TODO: Send an email to a list of admins
 */
function sendEmail() {
  const key = Date.now()

  return new Promise((res, rej) => {
    setTimeout(() => {
      if (key % 2 === 0) {
        res()
      } else {
        rej()
      }
    }, 1000)
  })
}

/**
 * TODO: Change the plan of a list of accounts
 */
function changePlan() {
  const key = Date.now()

  return new Promise((res, rej) => {
    setTimeout(() => {
      if (key % 2 === 0) {
        res()
      } else {
        rej()
      }
    }, 1000)
  })
}
/**
 * TODO: Change the state of a list of accounts
 */
function changeState() {
  const key = Date.now()

  return new Promise((res, rej) => {
    setTimeout(() => {
      if (key % 2 === 0) {
        res()
      } else {
        rej()
      }
    }, 1000)
  })
}

export { sendEmail, changePlan, changeState }
