import React, { useState, useEffect } from 'react';
import { TodoFormData } from '../types';

interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  initialData?: Partial<TodoFormData>;
  isEditing?: boolean;
  onCancel?: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  onSubmit,
  initialData,
  isEditing = false,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TodoFormData>({
    title: '',
    completed: false,
    priority: 'medium',
    description: '',
    ...initialData,
  });

  const [error, setError] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(!!initialData?.description || isEditing);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({ ...prev, ...initialData }));
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
        description: '',
      });
      setIsExpanded(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 transition-all duration-300 ${
        isExpanded ? 'border-l-4 border-indigo-500' : ''
      }`}
    >
      <div className="mb-5">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          タイトル <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="TODOのタイトルを入力"
          className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:outline-none transition-colors duration-200 text-gray-800 bg-gray-50 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-200'
          }`}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="flex items-center mb-5">
        <div className="w-1/2 pr-2">
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
            優先度
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none transition-colors duration-200 text-gray-800 bg-gray-50"
          >
            <option value="low">低</option>
            <option value="medium">中</option>
            <option value="high">高</option>
          </select>
        </div>

        <div className="w-1/2 pl-2 flex items-end">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors duration-200 flex items-center"
          >
            {isExpanded ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
                詳細を隠す
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                詳細を追加
              </>
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mb-5">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            詳細
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="詳細を入力（任意）"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:outline-none transition-colors duration-200 text-gray-800 bg-gray-50"
          />
        </div>
      )}

      <div className="flex justify-end space-x-3">
        {isEditing && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {isEditing ? '更新' : '追加'}
        </button>
      </div>
    </form>
  );
}; 