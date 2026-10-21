class DetailComment {
  constructor(payload) {
    this._verifyPayload(payload);

    const {
      id, username, date, content, isDelete, replies = [], likeCount = 0,
    } = payload;

    this.id = id;
    this.username = username;
    this.date = typeof date === 'string' ? date : new Date(date).toISOString();
    this.content = isDelete ? '**komentar telah dihapus**' : content;
    this.likeCount = likeCount;
    this.replies = replies;
  }

  _verifyPayload({
    id, username, date, content, isDelete, likeCount,
  }) {
    if (!id || !username || !date || !content || isDelete === undefined) {
      throw new Error('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (
      typeof id !== 'string'
      || typeof username !== 'string'
      || (typeof date !== 'string' && !(date instanceof Date))
      || typeof content !== 'string'
      || typeof isDelete !== 'boolean'
      || (likeCount !== undefined && typeof likeCount !== 'number')
    ) {
      throw new Error('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

export default DetailComment;
