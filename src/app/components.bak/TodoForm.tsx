import React, { useState, useEffect } from 'react';
import { TodoFormData } from '../types';

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  initialData?: Partial<TodoFormData>;
  isEditing?: boolean;
  isSubmitting?: boolean;
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  isSubmitting = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    completed: false,
    priority: 'medium',
    description: null,
    status: 'todo',
    order: null
  });

  const [error, setError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(!!initialData?.description || isEditing);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ 
        ...prev, 
        ...initialData,
        status: initialData.status || prev.status
      }));
      if (initialData.description) {
        setIsExpanded(true);
      }
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'title' && value.trim()) {
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    onSubmit(formData);
    if (!isEditing) {
      setFormData({
        title: '',
        completed: false,
        priority: 'medium',
        description: null,
        status: 'todo',
        order: null
      });
      setIsExpanded(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 border border-gray-200 dark:border-gray-700 ${
        isExpanded ? 'border-l-4 border-indigo-500 dark:border-indigo-400' : ''
      }`}
    >
      <div className="mb-5">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          タイトル <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="TODOのタイトルを入力"
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-colors duration-200 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 ${
            error
              ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800'
              : 'border-gray-200 dark:border-gray-700 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-indigo-200 dark:focus:ring-indigo-800'
          }`}
        />
        {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      <div className="flex items-center mb-5">
        <div className="w-1/2 pr-2">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            優先度
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>
        <div className="w-1/2 pl-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-8 px-4 py-3 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors duration-200"
          >
            {isExpanded ? (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
                詳細を隠す
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                詳細を追加
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mb-5 animate-fadeIn">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            詳細
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            placeholder="詳細な説明を入力（任意）"
            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
          ></textarea>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              処理中...
            </span>
          ) : (
            isEditing ? '更新' : '追加'
          )}
        </button>
      </div>
    </form>
  );
}; 