export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  tip: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: '你是否願意在未來 10 到 15 年，持續照顧牠？',
    options: ['不確定', '可以考慮', '我已做好準備'],
    answer: 2,
    tip: '領養之前，先確認時間、金錢與家人共識。'
  },
  {
    id: 'q2',
    prompt: '當牠生病、掉毛、吵鬧或破壞家具時，你會？',
    options: ['先放棄', '視情況處理', '學習並陪牠適應'],
    answer: 2,
    tip: '行為與照護都需要時間學習。'
  },
  {
    id: 'q3',
    prompt: '你是否願意先查看收容所資訊，再決定是否領養？',
    options: ['直接帶回家', '先看看再說', '先做功課與篩選'],
    answer: 2,
    tip: '先看資料，再看是否適合，能降低二次棄養風險。'
  },
  {
    id: 'q4',
    prompt: '如果條件還沒準備好，你會怎麼做？',
    options: ['暫緩領養', '先衝再說', '改看故事與知識'],
    answer: 0,
    tip: '先準備好，再迎接，是對生命負責。'
  }
];
