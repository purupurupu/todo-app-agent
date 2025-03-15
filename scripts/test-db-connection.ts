import { prisma } from '../lib/prisma';

async function main() {
  try {
    // データベース接続テスト
    console.log('データベース接続テスト開始...');
    
    // テスト用のTodoを作成
    const todo = await prisma.todo.create({
      data: {
        title: 'Prisma接続テスト',
        completed: false,
      },
    });
    
    console.log('作成されたTodo:', todo);
    
    // 作成したTodoを取得
    const todos = await prisma.todo.findMany();
    console.log('すべてのTodo:', todos);
    
    console.log('データベース接続テスト成功！');
  } catch (error) {
    console.error('データベース接続テスト失敗:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 