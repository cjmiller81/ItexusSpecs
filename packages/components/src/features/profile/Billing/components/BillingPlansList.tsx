import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import { BillingPlan } from "./BillingPlan";
import { AppDispatch, RootState } from "../../../../slices/store";
import { fetchPlansRequest } from "../../../../slices/billingSlice";


const BillingPlansList = () => {
    const dispatch = useDispatch();
    const { plans, loading, error } = useSelector((state: RootState) => state.billing);

    useEffect(() => {
        dispatch(fetchPlansRequest());
    }, [dispatch]);

    return (
        <div>
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            <Grid container spacing={3}>
                {plans.map((plan) => (
                    <BillingPlan
                        key={plan.id}
                        planName={plan.nickname || "Unnamed Plan"}
                        price={plan.unitAmount}
                        plans={plan.recurring ? [{ permission: plan.recurring.usageType }] : []}
                    />
                ))}
            </Grid>
        </div>
    );
};

export default BillingPlansList;
