import { useEffect, useState, useCallback, useRef } from 'react';
import { useAppDispatch } from '../slices/store';
import { 
  fetchReactourSettingsAsync, 
  updateReactourSettingsAsync 
} from '../slices/reactourSlice';

const TOUR_IDS = [
  'filter_builder_v1',
  'vaults_v1',
  'dex_aggregator_v1',
  'profile_v1',
  'decentralized_v1',
  'liquidity_pools_v1',
  'charts_v1',
  'home_v1',
  'mCapEqual_v1',
  'mCap_v1',
];

const LEGACY_TOUR_MAPPINGS: Record<string, string[]> = {
  'investing_v1': ['mCap_v1', 'mCapEqual_v1'],
  'wallet_v1': ['decentralized_v1'],
  'trading_v1': ['charts_v1'],
  'income_v1': ['vaults_v1', 'liquidity_pools_v1'],
};

export const useCentralizedTourMigration = () => {
  const dispatch = useAppDispatch();
  const [migrationCompleted, setMigrationCompleted] = useState(false);
  const migrationStartedRef = useRef(false);

  const checkForLocalStorageKeys = useCallback((): boolean => {
    for (const tourId of TOUR_IDS) {
      const stepKey = `EI_TOUR_${tourId}_STEP`;
      const viewedKey = `EI_TOUR_${tourId}_VIEWED`;
      
      if (localStorage.getItem(stepKey) !== null || localStorage.getItem(viewedKey) !== null) {
        return true;
      }
    }
    
    for (const legacyId of Object.keys(LEGACY_TOUR_MAPPINGS)) {
      const stepKey = `EI_TOUR_${legacyId}_STEP`;
      const viewedKey = `EI_TOUR_${legacyId}_VIEWED`;
      
      if (localStorage.getItem(stepKey) !== null || localStorage.getItem(viewedKey) !== null) {
        return true;
      }
    }
    
    return false;
  }, []);

  const migrateAllTours = useCallback(async () => {
    if (migrationStartedRef.current) {
      return;
    }
    
    migrationStartedRef.current = true;
    
    try {
      const hasLocalStorageData = checkForLocalStorageKeys();
      
      if (!hasLocalStorageData) {
        setMigrationCompleted(true);
        return;
      }

      const apiSettings = await dispatch(fetchReactourSettingsAsync()).unwrap();
      
      const migratedSettings: any = {
        tours: { ...apiSettings.tours }
      };
      
      let hasDataToMigrate = false;

      for (const tourId of TOUR_IDS) {
        const stepKey = `EI_TOUR_${tourId}_STEP`;
        const viewedKey = `EI_TOUR_${tourId}_VIEWED`;
        
        const localStep = localStorage.getItem(stepKey);
        const localViewed = localStorage.getItem(viewedKey);
        
        const hasApiData = apiSettings.tours && (
          apiSettings.tours[stepKey] !== undefined || 
          apiSettings.tours[viewedKey] !== undefined
        );
        
        if ((localStep !== null || localViewed !== null) && !hasApiData) {
          migratedSettings.tours[stepKey] = parseInt(localStep || '0', 10);
          migratedSettings.tours[viewedKey] = localViewed === '1' ? 1 : 0;
          hasDataToMigrate = true;
        }
        
        if (localStep !== null) localStorage.removeItem(stepKey);
        if (localViewed !== null) localStorage.removeItem(viewedKey);
      }

      for (const [legacyId, newIds] of Object.entries(LEGACY_TOUR_MAPPINGS)) {
        const legacyStepKey = `EI_TOUR_${legacyId}_STEP`;
        const legacyViewedKey = `EI_TOUR_${legacyId}_VIEWED`;
        
        const legacyStep = localStorage.getItem(legacyStepKey);
        const legacyViewed = localStorage.getItem(legacyViewedKey);
        
        if (legacyStep !== null || legacyViewed !== null) {
          for (const newId of newIds) {
            const newStepKey = `EI_TOUR_${newId}_STEP`;
            const newViewedKey = `EI_TOUR_${newId}_VIEWED`;
            
            const hasApiData = apiSettings.tours && (
              apiSettings.tours[newStepKey] !== undefined || 
              apiSettings.tours[newViewedKey] !== undefined
            );
            
            if (!hasApiData) {
              migratedSettings.tours[newStepKey] = parseInt(legacyStep || '0', 10);
              migratedSettings.tours[newViewedKey] = legacyViewed === '1' ? 1 : 0;
              hasDataToMigrate = true;
            }
          }
          
          if (legacyStep !== null) localStorage.removeItem(legacyStepKey);
          if (legacyViewed !== null) localStorage.removeItem(legacyViewedKey);
        }
      }
      
      if (hasDataToMigrate) {
        await dispatch(updateReactourSettingsAsync(migratedSettings)).unwrap();
      }
      
      setMigrationCompleted(true);
    } catch (error) {
      console.error('Tour migration failed:', error);
      setMigrationCompleted(true);
    }
  }, [dispatch, checkForLocalStorageKeys]);

  useEffect(() => {
    migrateAllTours();
  }, [migrateAllTours]);

  return {
    migrationCompleted,
    hasLocalStorageKeys: !migrationCompleted && checkForLocalStorageKeys(),
  };
};

