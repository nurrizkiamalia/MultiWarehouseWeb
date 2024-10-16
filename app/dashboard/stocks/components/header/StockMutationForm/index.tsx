import * as Yup from "yup";
import {Dispatch, FC, SetStateAction, useState} from "react";
import {Button} from "@/components/ui/button";
import {Form, Formik} from "formik";
import ProductInput from "@/app/dashboard/stocks/components/header/StockMutationForm/ProductInput";
import WarehouseInput from "@/app/dashboard/stocks/components/header/StockMutationForm/WarehouseInput";
import QuantityInput from "@/app/dashboard/stocks/components/header/StockMutationForm/QuantityInput";
import {useRequestMutation, useRestock} from "@/hooks/useStock";


const StockMutationSchema = Yup.object().shape({
    productId: Yup.number().required().min(1),
    warehouseToId: Yup.number().required(),
    warehouseFromId: Yup.number(),
    quantity: Yup.number().required().min(1),
    maxQuantity: Yup.number(),
})

interface StockMutationFormProps {
    setOpen: Dispatch<SetStateAction<boolean>>;
    warehouseId: number;
}

const StockMutationForm: FC<StockMutationFormProps> = ({setOpen, warehouseId}) => {
    const [type, setType] = useState<'restock' | 'mutation'>('restock')
    const restock = useRestock()
    const mutation = useRequestMutation()

    const handleSubmit = (values: { productId: number; warehouseToId: number; warehouseFromId: number; quantity: number; maxQuantity: number; }) => {
        if (type === 'mutation') {
            mutation.mutate(values)
        } else {
            restock.mutate(values)
        }
        setOpen(false)
    }

    return (
        <>
            <div className={"flex justify-center gap-8 mb-4"}>
                <Button
                    className={"w-24"}
                    onClick={() => setType("restock")}
                    variant={type === 'restock' ? "default" : "outline"}
                >
                    Restock
                </Button>
                <Button
                    className={"w-24"}
                    onClick={() => setType("mutation")}
                    variant={type === 'mutation' ? "default" : "outline"}
                >
                    Mutate
                </Button>
            </div>
            <Formik
                initialValues={{
                    productId: 0,
                    warehouseToId: warehouseId,
                    warehouseFromId: 0,
                    quantity: 1,
                    maxQuantity: 999
                }}
                onSubmit={(values) => handleSubmit(values)}
                validationSchema={StockMutationSchema}
            >
                <Form className={"flex flex-col gap-2 w-full"}>
                    <ProductInput />
                    {type === 'mutation' && <WarehouseInput />}
                    <QuantityInput />
                    <Button type={"submit"}>Submit</Button>
                </Form>
            </Formik>
        </>
    )
}

export default StockMutationForm