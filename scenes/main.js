const MoveSpeed = 150
const timeLeft = 10
const InvaderSpeed = 360
let CurrentSpeed = InvaderSpeed
const LevelDown = 80

layer(['obj', 'ui'], 'obj')

addLevel([
  '!^ ^  ^ ^^    &',
  '!^^ ^^^ ^ ^   &',
  '!^^^^^^^ ^^   &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  '!             &',
  ], {
    width: 30,
    height: 20,
    '^' : [sprite('space invader'), 'space invader'],
    '!' : [sprite('wall'), 'left-Wall'],
    '&' : [sprite('wall'), 'right-Wall'],
  })

  const player = add([
    sprite('spaceship'),
    scale(1.4),
    pos( width() / 2, height() / 2),
    origin('center')
  ])

  keyDown( 'left', ()=> {
    player.move(-MoveSpeed, 0)
  })

  keyDown( 'right', ()=> {
    player.move(MoveSpeed, 0)
  })

  function spawnBullet(p) {
    add([rect(6,18), 
    pos(p), origin('center'),
     color(0.5,0.5,1),
     'bullet'
    ])
  }

  keyPress( 'space', () => {
    spawnBullet(player.pos.add(0,0))
  })

  const BulletSpeed = 400
  action('bullet', (b) => {
    b.move(0, -BulletSpeed)
    if (b.pos.y < 0 )
    {
      destroy(b)
    }
  })

   collides( 'bullet', 'space invader', (b,s) => {
     camShake(5)
     destroy(b)
     destroy(s)
     score.value++
     score.text = score.value
   })

  const score = add([
    text('0'),
    pos (50,50),
    layer('ui'),
    scale(3),
    {
      value: 0,
    }
  ])

  

  const timer = add([
    text('0:00'),
    pos(100,50),
    layer('ui'),
    scale(2),
    {
        time: timeLeft,
    },
  ])

  timer.action(() => {
    timer.time -= dt()
    timer.text = timer.time.toFixed(2)

    if (timer.time <= 0){
      go('lose', {score :score.value})
    }
  })
  

  action('space invader', (s) => {
    s.move(CurrentSpeed, 0)
  })

  collides('space invader','right-Wall',() => {
    CurrentSpeed = -InvaderSpeed

    every('space invader', (s) => {
      s.move(0,LevelDown)
    })
  })

  collides('space invader','left-Wall', () => {
    CurrentSpeed = InvaderSpeed
    every('space invader', (s) => {
      s.move(0,LevelDown)
    })
  })

  player.overlaps('space invader', ()=>{
    go('lose', {score: score.value})
  })

  action('space invader', (s) =>{
    if (s.pos.y >= height / 2){
      go('lose', {score: score.value})
    }
  })

 