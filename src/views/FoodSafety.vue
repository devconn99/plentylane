<template>
    <div id="home-page">
        <Header activeItem="terms"></Header>

        <main>
            <section class="header-with-wave">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-12 mx-auto mb-5 mb-sm-0 text-center mt-md-4">
                            <h1 class="title-size1 titleGreenNavyColor mb-4">Food Safety</h1>
                        </div>
                    </div>
                </div>

                <img class="header-img-doors" src="../assets/images/elements/landing/hero/header.svg" alt="">
            </section>

            <section class="faq pad-70">
                <div class="container">
                    <div class="row">
                        <div class="col-12 mx-auto">
                            <p class="text-bold">Is there a risk of getting Covid-19 by swapping meals?</p>
                            <p>
                                We at Plenty Lane are not scientists, so we rely on the expertise of those who are.
                                The <a class="text-underline" href="https://www.fda.gov/food/food-safety-during-emergencies/food-safety-and-coronavirus-disease-2019-covid-19" target="_blank">FDA’s website</a> states:
                            </p>
                            <p class="text-italic titleGreenLightColor">
                                Currently there is no evidence of food or food packaging being associated with
                                transmission of COVID-19. Foodborne gastrointestinal (GI) viruses, like norovirus and
                                hepatitis A, can make people ill through contaminated food. SARS-CoV-2, which causes
                                COVID-19, is a virus that causes respiratory illness.
                            </p>
                            <p>
                                The FDA advises we all adopt everyday safe food handling and hygiene practices to avoid
                                foodborne illness. Please read through the following for more information.
                            </p>
                            <ul class="list-default">
                                <li>
                                    <a href="https://www.fda.gov/food/buy-store-serve-safe-food/safe-food-handling" class="text-underline" target="_blank">Safe Food Handling</a>
                                </li>
                                <li>
                                    <a href="https://www.fda.gov/food/buy-store-serve-safe-food/food-safety-your-kitchen" class="text-underline" target="_blank">Food Safety in Your Kitchen</a>
                                </li>
                                <li>
                                    <a href="https://www.fda.gov/food/buy-store-serve-safe-food/everyday-food-safety-young-adults" class="text-underline" target="_blank">Everyday Food Safety for Young Adults</a>
                                </li>
                                <li>
                                    <a href="https://www.fda.gov/food/buy-store-serve-safe-food/handling-flour-safely-what-you-need-know" class="text-underline" target="_blank">Handling Flour Safely</a>
                                </li>
                                <li>
                                    <a href="https://www.fda.gov/food/consumers/tips-reduce-food-waste" class="text-underline" target="_blank">Tips to Reduce Food Waste</a>
                                </li>
                            </ul>
                            <p>Opting for contactless pick up reduces risks too.</p>
                            <p class="text-bold">Is eating food prepared by others safe?</p>
                            <p>
                                We expect everyone to follow the Food Safety guidelines established by the
                                <a class="text-underline" href="https://www.cdc.gov/foodsafety/index.html" target="_blank">CDC</a>, the
                                <a class="text-underline" href="https://www.fsis.usda.gov/wps/portal/fsis/topics/food-safety-education/featured-campaign" target="_blank">USDA</a>, and
                                <a class="text-underline" href="https://www.foodsafety.gov/" target="_blank">FoodSafety.gov</a>, and
                                require that every participating member of Plenty Lane comply with our
                                <router-link to="/terms" v-slot="{ href }">
                                    <a class="text-underline" :href="href" target="_blank">Website Terms of Use</a>
                                </router-link>. We also hope you have plenty of friends and known neighbors in your
                                swap network and that eating their meals would feel as comfortable as a potluck or
                                dinner party with them. In the end, it is up to you to decide what makes you feel most safe.
                            </p>
                            <p class="text-bold">What food safety protocols should I follow?</p>
                            <p>
                                We are so glad you asked! We expect everyone to follow the food safety guidelines established by the
                                <a class="text-underline" href="https://www.cdc.gov/foodsafety/keep-food-safe.html" target="_blank">Centers for Disease Control and Prevention</a> and
                                follow four simple steps: Clean, Separate, Cook and Chill. The following is from the CDC’s website:
                            </p>
                            <p class="text-underline">Clean: Wash your hands and surfaces often.</p>
                            <ul class="list-default">
                                <li>
                                    Germs that cause food poisoning can survive in many places and spread
                                    <a class="text-underline" href="https://www.cdc.gov/foodsafety/communication/gearup-food-safety.html" target="_blank">around your kitchen</a>.
                                </li>
                                <li>
                                    Wash hands for 20 seconds with soap and water before, during, and after preparing food and before eating.
                                </li>
                                <li>Wash your utensils, cutting boards, and countertops with hot, soapy water.</li>
                                <li>
                                    Rinse fresh
                                    <a class="text-underline" href="https://www.cdc.gov/foodsafety/communication/steps-healthy-fruits-veggies.html" target="_blank">fruits and vegetables</a> under
                                    running water.
                                </li>
                            </ul>
                            <p class="text-underline">Separate: Don’t cross-contaminate.</p>
                            <ul class="list-default">
                                <li>
                                    Raw meat, poultry, seafood, and eggs can spread germs to ready-to-eat foods—unless you keep them separate.
                                </li>
                                <li>
                                    Use separate cutting boards and plates when cooking with raw meat, poultry, or seafood.
                                </li>
                                <li>
                                    When grocery shopping, keep raw meat, poultry, seafood, and their juices away from other foods.
                                </li>
                                <li>
                                    Keep raw meat, poultry, seafood, and eggs separate from all other foods in the fridge.
                                </li>
                            </ul>
                            <p class="text-underline">Cook: To the right temperature.</p>
                            <ul class="list-default">
                                <li>
                                    Food is safely cooked when the internal temperature gets high enough to kill germs
                                    that can make you sick. The only way to tell if food is safely cooked is to use a
                                    food thermometer. You can’t tell if food is safely cooked by checking its color and texture.
                                </li>
                                <li>
                                    Use a food thermometer to ensure foods are cooked to a safe internal temperature. Check this
                                    <a class="text-underline" href="https://www.foodsafety.gov/food-safety-charts/safe-minimum-cooking-temperature" target="_blank">chart for a detailed list of foods and temperature</a>.
                                </li>
                            </ul>
                            <p class="text-underline">Chill: Refrigerate promptly.</p>
                            <ul class="list-default">
                                <li>
                                    Keep your refrigerator at 40°F or below and know when to
                                    <a class="text-underline" href="https://www.foodsafety.gov/food-safety-charts/cold-food-storage-charts" target="_blank">throw food out</a>.
                                </li>
                                <li>
                                    Refrigerate perishable food within 2 hours. (If outdoor temperature is above 90°F, refrigerate within 1 hour.)
                                </li>
                                <li>
                                    Thaw frozen food safely in the refrigerator, in cold water, or in the microwave.
                                    Never thaw foods on the counter, because bacteria multiply quickly in the parts of
                                    the food that reach room temperature.
                                </li>
                            </ul>
                            <p>
                                You can find more information on food safety at the
                                <a class="text-underline" href="https://www.fsis.usda.gov/wps/portal/fsis/topics/food-safety-education/featured-campaign" target="_blank">USDA</a> and
                                <a class="text-underline" href="https://www.foodsafety.gov/" target="_blank">FoodSafety.gov websites</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <PromoLogo></PromoLogo>
        </main>

        <Footer></Footer>

        <BackToTop></BackToTop>
    </div>
</template>

<script>
import Footer from '../components/homepage/Footer';
import Header from '../components/homepage/Header';
import BackToTop from '../components/BackToTop';
import PromoLogo from '../components/homepage/PromoLogo';

export default {
    name: "FoodSafety",
    components: {Footer, Header, BackToTop, PromoLogo}
}
</script>

<style scoped>

</style>
