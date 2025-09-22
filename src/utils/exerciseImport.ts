import { ExerciseType } from '@/types/exercises';
import type { Exercise } from '@/types/exercises';

export interface ImportableExercise {
  name: string;
  type: ExerciseType;
  description?: string;
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors: string[];
  exercises: Exercise[];
}

export const importExercisesFromFile = async (file: File): Promise<ImportResult> => {
  const result: ImportResult = {
    success: false,
    importedCount: 0,
    errors: [],
    exercises: [],
  };

  try {
    // Read file content
    const fileContent = await readFileAsText(file);

    // Parse JSON
    let importData: ImportableExercise[];
    try {
      importData = JSON.parse(fileContent);
    } catch {
      result.errors.push('Invalid JSON format');
      return result;
    }

    // Validate that it's an array
    if (!Array.isArray(importData)) {
      result.errors.push('File must contain an array of exercises');
      return result;
    }

    // Process each exercise
    for (let i = 0; i < importData.length; i++) {
      const item = importData[i];
      const exerciseIndex = i + 1;

      // Validate required fields
      if (!item.name || typeof item.name !== 'string') {
        result.errors.push(`Exercise ${exerciseIndex}: Missing or invalid name`);
        continue;
      }

      if (!item.type || !Object.values(ExerciseType).includes(item.type)) {
        result.errors.push(`Exercise ${exerciseIndex}: Missing or invalid type`);
        continue;
      }

      // Validate description if provided
      if (item.description !== undefined && typeof item.description !== 'string') {
        result.errors.push(`Exercise ${exerciseIndex}: Description must be a string`);
        continue;
      }

      // Create exercise object based on type
      const exercise: Exercise = {
        id: generateId(),
        name: item.name.trim(),
        type: item.type,
        description: item.description?.trim(),
      };

      result.exercises.push(exercise);
    }

    result.importedCount = result.exercises.length;
    result.success = result.errors.length === 0;
  } catch (error) {
    result.errors.push(
      `Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }

  return result;
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to read file as text'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const createImportTemplate = (): ImportableExercise[] => {
  return [
    {
      name: 'Bench Press',
      type: ExerciseType.WEIGHT,
      description: 'Classic chest exercise',
    },
    {
      name: 'Push-ups',
      type: ExerciseType.REPS_ONLY,
      description: 'Bodyweight chest exercise',
    },
    {
      name: 'Plank',
      type: ExerciseType.TIME,
      description: 'Core strengthening exercise',
    },
  ];
};
