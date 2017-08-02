export default class Reply {
  constructor ({
    id,
    loginname,
    avatar_url,
    content,
    reply_id
  }) {
    this.id = id
    this.author = {}
    this.author.loginname = loginname
    this.author.avatar_url = avatar_url
    this.content = content
    this.ups = []
    this.create_at = new Date()
    this.reply_id = reply_id || null
    this.is_uped = false
  }
}
