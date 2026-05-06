export interface StoryScene {
  title: string;
  subtitle: string;
  content: string;
  highlight: string;
  accent: 'dog' | 'cat' | 'guide';
}

export const storyScenes: StoryScene[] = [
  {
    title: '浪狗的夜晚',
    subtitle: '當陪伴變成責任，流浪就不該是結局。',
    content: '一隻曾經被照顧的狗狗，在路邊等待一個不會再回來的家。這不是牠的錯，而是人類沒有做到承諾。',
    highlight: '領養不是衝動，而是承諾。',
    accent: 'dog'
  },
  {
    title: '浪貓的自由',
    subtitle: 'TNVR 與管理，讓牠們有機會安穩生活。',
    content: '街頭的貓並不都需要被「擁有」，但牠們仍需要被尊重、被理解，也需要在對的情境裡被友善對待。',
    highlight: '了解牠們，比定義牠們更重要。',
    accent: 'cat'
  },
  {
    title: '從劇情走到行動',
    subtitle: '故事的終點，要連到真正的領養流程。',
    content: '看完故事，下一步不是結束，而是開始找一隻適合你的毛孩，先理解牠，再決定是否帶牠回家。',
    highlight: '下一步：去找一隻適合你的浪浪。',
    accent: 'guide'
  }
];
