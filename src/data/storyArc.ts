export interface StoryChoice {
  label: string;
  note: string;
  nextId: string;
  trustDelta: number;
}

export interface StoryNode {
  id: string;
  scene: 'dusk' | 'alley' | 'street' | 'shelter' | 'dawn';
  sceneLabel: string;
  speaker: string;
  title: string;
  text: string;
  hint: string;
  portrait: string;
  kind: 'narration' | 'choice' | 'ending';
  nextId?: string;
  nextLabel?: string;
  choices?: StoryChoice[];
  endingTitle?: string;
  endingText?: string;
}

export const storyNodes: StoryNode[] = [
  {
    id: 'open',
    scene: 'dusk',
    sceneLabel: '黃昏・巷口',
    speaker: '浪人',
    title: '黃昏的第一個聲音',
    text: '我在巷口聽見一點點沙沙聲，像有人把世界折成很小一格。那不是誤會，是一隻流浪太久的狗，正縮在陰影裡。',
    hint: '先別急著按下一步，這段是把你拉進現場的入口。',
    portrait: '/images/boy.svg',
    kind: 'narration',
    nextId: 'dog-choice',
    nextLabel: '走近一點'
  },
  {
    id: 'dog-choice',
    scene: 'alley',
    sceneLabel: '巷弄・靠近',
    speaker: '浪狗',
    title: '你會怎麼靠近牠？',
    text: '牠沒有衝過來，只是把耳朵往後壓，像是在確認你是不是會跟前一個人一樣離開。',
    hint: '這裡不是考答案，是看你想怎麼和牠建立信任。',
    portrait: '/images/y-dog-sad.svg',
    kind: 'choice',
    choices: [
      {
        label: '先蹲下來安撫牠',
        note: '溫和、穩定，讓牠先知道你沒有敵意。',
        nextId: 'dog-memory',
        trustDelta: 2
      },
      {
        label: '先找項圈或聯絡資訊',
        note: '務實確認牠是不是走失，也是在幫牠找回家。',
        nextId: 'dog-memory',
        trustDelta: 1
      },
      {
        label: '先拍照通知附近的人',
        note: '先求助沒有錯，但別讓牠在恐懼中等待太久。',
        nextId: 'dog-memory',
        trustDelta: 0
      }
    ]
  },
  {
    id: 'dog-memory',
    scene: 'street',
    sceneLabel: '街道・故事開始',
    speaker: '浪狗',
    title: '牠終於說起自己',
    text: '牠說自己曾經有家，後來因為大人的決定，世界突然換了一種溫度。這一段不是牠犯錯，而是牠被迫流浪。',
    hint: '很多棄養不是一瞬間，而是一次次的退讓。',
    portrait: '/images/y-dog-sad.svg',
    kind: 'narration',
    nextId: 'cat-choice',
    nextLabel: '再往前走'
  },
  {
    id: 'cat-choice',
    scene: 'street',
    sceneLabel: '街角・第二個相遇',
    speaker: '浪貓',
    title: '另一側的自由怎麼理解？',
    text: '在牆角，還有一隻耳朵缺了一角的貓。牠看起來自由，但真正的自由也需要被理解，而不是被浪漫化。',
    hint: '這裡把故事從「感傷」拉回「認知」。',
    portrait: '/images/cat_1.svg',
    kind: 'choice',
    choices: [
      {
        label: '尊重 TNVR 與社區照護',
        note: '理解街貓不是全部都要帶走，重點是有沒有被好好照顧。',
        nextId: 'shelter-scene',
        trustDelta: 2
      },
      {
        label: '立刻想把牠帶回家',
        note: '有善意，但還要先判斷環境與牠是否真的適合被收編。',
        nextId: 'shelter-scene',
        trustDelta: 0
      },
      {
        label: '先查收容所與認養流程',
        note: '把感受收束成下一步，是這個網站真正想做的事。',
        nextId: 'shelter-scene',
        trustDelta: 1
      }
    ]
  },
  {
    id: 'shelter-scene',
    scene: 'shelter',
    sceneLabel: '收容所・現實的入口',
    speaker: '浪人',
    title: '不是每個結局都能直接回家',
    text: '我終於學會，真正重要的不是把牠「帶走」而已，而是確認自己有沒有能力照顧牠一輩子，並且用正確的流程把牠帶回家。',
    hint: '最後一步，應該接到領養探索與自評。',
    portrait: '/images/boy.svg',
    kind: 'narration',
    nextId: 'ending',
    nextLabel: '查看結局'
  },
  {
    id: 'ending',
    scene: 'dawn',
    sceneLabel: '天亮了',
    speaker: '系統',
    title: '結局由你的選擇決定',
    text: '當你願意先理解、再準備、最後才行動，領養就不只是同情，而是一個負責任的開始。',
    hint: '這裡會依 trust 值顯示不同的結局文案。',
    portrait: '/images/y-dog.svg',
    kind: 'ending',
    endingTitle: '願意陪伴，才算真的準備好',
    endingText: '你的選擇已經把感受變成了責任。下一步，去領養探索頁找一隻真正適合你的浪浪。',
    nextLabel: '回到領養探索'
  }
];

export const storyOrder = storyNodes.map((node) => node.id);
