'use client';
import {
  getFoodConsistency,
  getLiquidConsistency,
  getMealSize,
} from '@/actions';
import Loading from '@/components/composed/Loading';
import { SubmitButton } from '@/components/composed/SubmitButton';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FoodConsistency, LiquidConsistency, MealSize } from '@/lib/db/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState, useTransition } from 'react';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { z } from 'zod';

const mealSchema = z.object({
  default_meal_size_id: z.number().optional(),
  default_food_consistency_id: z.number().optional(),
  default_liquid_consistency_id: z.number().optional(),
});

const MealStepForm = ({ clientId }: { clientId: string }) => {
  const [mealSize, setMealSize] = useState([] as MealSize[]);
  const [foodConsistency, setFoodConsistency] = useState(
    [] as FoodConsistency[]
  );
  const [liquidConsistency, setLiquidConsistency] = useState(
    [] as LiquidConsistency[]
  );

  const form = useForm<z.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      default_meal_size_id: undefined,
      default_food_consistency_id: undefined,
      default_liquid_consistency_id: undefined,
    },
  });

  const [isPending, startTransition] = useTransition();

  const mealOptions = mealSize.map((meal) => (
    <SelectItem key={meal.id} value={meal.id.toString()}>
      {meal.size_name}
    </SelectItem>
  ));

  const foodConsistencyOptions = foodConsistency.map((food) => (
    <SelectItem key={food.id} value={food.id.toString()}>
      {food.food_consistency_name}
    </SelectItem>
  ));

  const liquidConsistencyOptions = liquidConsistency.map((liquid) => (
    <SelectItem key={liquid.id} value={liquid.id.toString()}>
      {liquid.liquid_consistency_name}
    </SelectItem>
  ));

  const handleNumericValueChange = (field: any) => (value: string) => {
    const numericValue = Number(value);
    if (!isNaN(numericValue)) {
      field.onChange(numericValue);
    } else {
      console.error('Invalid selection');
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [mealSize, foodConsistency, liquidConsistency] =
          await Promise.all([
            getMealSize(),
            getFoodConsistency(),
            getLiquidConsistency(),
          ]);
        setMealSize(mealSize);
        setFoodConsistency(foodConsistency);
        setLiquidConsistency(liquidConsistency);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    })();
  }, []);

  return (
    <>
      <div className='relative flex-col items-start gap-8 md:flex pt-6'>
        <Form {...form}>
          <form className='grid w-full items-start gap-6'>
            <div className='grid grid-cols-1 md:grid-cols-1 gap-6 md:w-3/4 w-full m-auto'>
              <fieldset
                className={`grid gap-6 rounded-lg border p-4 
              }`}
              >
                <legend className='-ml-1 px-1 text-sm font-medium'>
                  Meal size and consistency
                </legend>
                <FormField
                  control={form.control}
                  name='default_meal_size_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal size</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          name={field.name}
                          onValueChange={handleNumericValueChange(field)}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder='Select a meal size'
                              ref={field.ref}
                            />
                          </SelectTrigger>
                          <SelectContent>{mealOptions}</SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='default_food_consistency_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food consistency</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          name={field.name}
                          onValueChange={handleNumericValueChange(field)}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder='Select a food consistency'
                              ref={field.ref}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {foodConsistencyOptions}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='default_liquid_consistency_id'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Liquid consistency</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value?.toString()}
                          name={field.name}
                          onValueChange={handleNumericValueChange(field)}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder='Select a liquid consistency'
                              ref={field.ref}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {liquidConsistencyOptions}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
              <div className='flex justify-end gap-4'>
                <Button type='button' variant={'secondary'}>
                  Skip
                </Button>
                <SubmitButton
                  variant={'default'}
                  loading={<Loading />}
                  label={'Next'}
                  isSubmmitting={isPending}
                />
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
export default MealStepForm;
