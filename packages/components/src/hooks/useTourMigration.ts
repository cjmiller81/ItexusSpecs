import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../slices/store';
import { 
  fetchReactourSettingsAsync, 
  updateReactourSettingsAsync, 
  updateTourStatusAsync 
} from '../slices/reactourSlice';

interface UseTourMigrationProps {
  tourId: string;
  tourName: string;
  isOpen: boolean;
  currentStep: number;
  totalSteps: number;
  onMigrationComplete?: () => void;
}

interface UseTourMigrationReturn {
  migrationCompleted: boolean;
  manuallyClosedInSession: boolean;
  viewed: boolean;
  savedStep: number;
  reactourSettings: any;
  resetTour: () => void;
}

export const useTourMigration = ({
  tourId,
  tourName,
  isOpen,
  currentStep,
  totalSteps,
  onMigrationComplete,
}: UseTourMigrationProps): UseTourMigrationReturn => {
  const dispatch = useAppDispatch();
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const [manuallyClosedInSession, setManuallyClosedInSession] = useState(false);
  const [tourWasOpened, setTourWasOpened] = useState(false);
  const [viewed, setViewed] = useState(true);
  const migrationStartedRef = useRef(false);

  const reactourSettings = useAppSelector((state) => state.reactour.settings);

  const migrateFromLocalStorage = useCallback(async () => {
    if (migrationStartedRef.current) {
      return;
    }
    
    migrationStartedRef.current = true;
    
    try {
      const localStep = localStorage.getItem(`EI_TOUR_${tourId}_STEP`);
      const localViewed = localStorage.getItem(`EI_TOUR_${tourId}_VIEWED`);
      
      const hasLocalStorageData = localStep !== null || localViewed !== null;
      
      const apiSettings = await dispatch(fetchReactourSettingsAsync()).unwrap();
      
      const stepKey = `EI_TOUR_${tourId}_STEP`;
      const viewedKey = `EI_TOUR_${tourId}_VIEWED`;
      const hasApiData = apiSettings.tours && (
        apiSettings.tours[stepKey] !== undefined || 
        apiSettings.tours[viewedKey] !== undefined
      );
      
      if (hasLocalStorageData) {
        if (!hasApiData) {
          const migratedSettings = {
            tours: {
              ...apiSettings.tours,
              [stepKey]: parseInt(localStep || '0', 10),
              [viewedKey]: localViewed === '1' ? 1 : 0,
            }
          };
          
          await dispatch(updateReactourSettingsAsync(migratedSettings)).unwrap();
        }
        
        localStorage.removeItem(`EI_TOUR_${tourId}_STEP`);
        localStorage.removeItem(`EI_TOUR_${tourId}_VIEWED`);
      }
      
      const isViewed = apiSettings.tours?.[`EI_TOUR_${tourId}_VIEWED`] === 1;
      setViewed(isViewed);
      
      setMigrationCompleted(true);
      if (onMigrationComplete) {
        onMigrationComplete();
      }
    } catch (error) {
      setMigrationCompleted(true);
    }
  }, [dispatch, tourId, onMigrationComplete]);

  useEffect(() => {
    migrateFromLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const savedStep = reactourSettings 
    ? (reactourSettings.tours[`EI_TOUR_${tourId}_STEP`] || 0)
    : 0;

  useEffect(() => {
    if (!migrationCompleted || !isOpen) return;
    
    const isLastStep = currentStep >= totalSteps - 1;
    
    dispatch(updateTourStatusAsync({
      tourName: tourName,
      update: { 
        step: currentStep,
        viewed: isLastStep ? true : undefined
      }
    }));
  }, [currentStep, totalSteps, migrationCompleted, isOpen, dispatch, tourId, tourName]);

  useEffect(() => {
    if (!migrationCompleted) return;
    
    if (!isOpen && tourWasOpened) {
      setManuallyClosedInSession(true);
      setViewed(true);
      
      dispatch(updateTourStatusAsync({
        tourName: tourName,
        update: { step: currentStep, viewed: true }
      }));
    } else if (isOpen) {
      setTourWasOpened(true);
      setViewed(true);
    }
  }, [isOpen, tourWasOpened, migrationCompleted, dispatch, currentStep, tourId, tourName]);

  const resetTour = useCallback(() => {
    setManuallyClosedInSession(false);
    setViewed(false);
    
    dispatch(updateTourStatusAsync({
      tourName: tourName,
      update: { step: 0, viewed: false }
    }));
  }, [dispatch, tourId, tourName]);

  return {
    migrationCompleted,
    manuallyClosedInSession,
    viewed,
    savedStep,
    reactourSettings,
    resetTour,
  };
};

