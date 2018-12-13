const Router = require('koa-router');
const router = new Router({
  prefix: '/member'
});
const dbpool = require('../dbpool.js');

// 전체 고객 요청
router.get('/', async (ctx, next) => {
  const client = ctx.request.ip;
  console.log("server: client request.(" + client + " /member)");
  ctx.body = await dbpool.fetch('SELECT * FROM zix.member')
});

// 고객아이디로 고객 요청
router.get('/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const client = ctx.request.ip;
  console.log("server: client request.(" + client + " /member/" + id + ")");
  ctx.body = await dbpool.fetch('SELECT * FROM zix.member WHERE mem_id=' + id + '');
});

// 고객 정보 수정 요청
router.post('/modify/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const client = ctx.request.ip;
  const member = ctx.request.body;
  console.log("server: client request.(" + client + " /member_receiver/modify" + id + ")");
  const query =
    `UPDATE zix.member SET
    mem_email = "${member.mem_email}",
    mem_phone = "${member.mem_phone}",
    mem_address = "${member.mem_address}",
    mem_birthday = "${member.mem_birthday}",
    mem_remarks = "${member.mem_remarks}"
    WHERE mem_id = ${id}`
  const success = await dbpool.fetch(query);
  ctx.body = (success != false) ? true : false;
});

// 신규 고객 등록 요청
router.post('/register', async (ctx, next) => {
  const client = ctx.request.ip;
  const member = ctx.request.body;
  console.log("server: client request.(" + client + " /new_member_receiver/)");
  const query =
    `INSERT INTO
    zix.member (mem_userid, mem_username, mem_email,
    mem_phone, mem_birthday, mem_address, mem_remarks)
    VALUES ("${member.mem_userid}", "${member.mem_username}", "${member.mem_email}",
    "${member.mem_phone}", ${(member.mem_birthday==null)?'NULL':`"${member.mem_birthday}"`}, "${member.mem_address}", "${member.mem_remarks}")`
  const success = await dbpool.fetch(query);
  ctx.body = (success != false) ? true : false;
});

// 고객 삭제 요청
router.post('/delete/:id', async (ctx, next) => {
  const id = ctx.params.id;
  const client = ctx.request.ip;
  console.log("server: client request.(" + client + " /member_receiver/delete/" + id + ")");
  const query = 'DELETE FROM zix.member WHERE (mem_id = ' + id + ')';
  const success = await dbpool.fetch(query);
  ctx.body = (success != false) ? true : false;
});

module.exports = router;
