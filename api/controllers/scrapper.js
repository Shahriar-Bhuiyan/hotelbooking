import axios from "axios";
import cheerio from "cheerio";
import { json } from "express";
import { v4 as uuidv4 } from "uuid";

const links = {
  dhaka: "https://www.booking.com/searchresults.html?aid=340295&label=metatrivago-hotel-1484822_xqdz-cf6e40_los-1_nrm-1_gstadt-2_gstkid-0_curr-usd_lang-en-us_mcid-10_dev-dsk_losb-1_bw-14_bwb-8_pg-2_dd-0_gsb-2_sl-0_w-0_tstar-0_trat-0_tprc-tprcd_tamnt-0_cod-1686221737_trvref-b8f1df9c-b94e-3405-8fba-fa6fe97664a3&utm_medium=meta&trv_curr=USD&no_rooms=1&show_room=148482215_97532119_2_42_0&lang=en-us&trv_dp=105&utm_content=los-1_nrm-1_gstadt-2_gstkid-0_curr-usd_lang-en-us_mcid-10_dev-dsk_losb-1_bw-14_bwb-8_pg-2_dd-0_gsb-2_sl-0_w-0_tstar-0_trat-0_tprc-tprcd_tamnt-0_cod-1686221737_trvref-b8f1df9c-b94e-3405-8fba-fa6fe97664a3&utm_campaign=us&utm_term=hotel-1484822&utm_source=metatrivago&highlighted_hotels=1484822&checkin=2023-06-22&redirected=1&city=-2737683&hlrd=with_dates&selected_currency=USD&group_adults=2&source=hotel&group_children=0&checkout=2023-06-23&keep_landing=1&sid=3c71e3bf4c355c7c37cfa3806fac6926",
  bali: "https://www.booking.com/searchresults.html?ss=balli&ssne=Dhaka&ssne_untouched=Dhaka&highlighted_hotels=1484822&label=metatrivago-hotel-1484822_xqdz-cf6e40_los-1_nrm-1_gstadt-2_gstkid-0_curr-usd_lang-en-us_mcid-10_dev-dsk_losb-1_bw-14_bwb-8_pg-2_dd-0_gsb-2_sl-0_w-0_tstar-0_trat-0_tprc-tprcd_tamnt-0_cod-1686221737_trvref-b8f1df9c-b94e-3405-8fba-fa6fe97664a3&sid=3c71e3bf4c355c7c37cfa3806fac6926&aid=340295&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_id=-1208880&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=119d9fe9ae970001&ac_meta=GhAxMTlkOWZlOWFlOTcwMDAxIAAoATICZW46BWJhbGxpQABKAFAA&checkin=2023-06-22&checkout=2023-06-23&group_adults=2&no_rooms=1&group_children=0",
  coxsBazar: "https://www.booking.com/searchresults.html?ss=Cox%27s+Bazar%2C+Bangladesh&ssne=Ballito&ssne_untouched=Ballito&highlighted_hotels=1484822&label=metatrivago-hotel-1484822_xqdz-cf6e40_los-1_nrm-1_gstadt-2_gstkid-0_curr-usd_lang-en-us_mcid-10_dev-dsk_losb-1_bw-14_bwb-8_pg-2_dd-0_gsb-2_sl-0_w-0_tstar-0_trat-0_tprc-tprcd_tamnt-0_cod-1686221737_trvref-b8f1df9c-b94e-3405-8fba-fa6fe97664a3&sid=3c71e3bf4c355c7c37cfa3806fac6926&aid=340295&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_id=211349&dest_type=city&checkin=2023-06-22&checkout=2023-06-23&group_adults=2&no_rooms=1&group_children=0",
  manali: "https://www.booking.com/searchresults.html?ss=Man%C4%81li%2C+Himachal+Pradesh%2C+India&ssne=Cox%27s+Bazar&ssne_untouched=Cox%27s+Bazar&highlighted_hotels=1484822&label=metatrivago-hotel-1484822_xqdz-cf6e40_los-1_nrm-1_gstadt-2_gstkid-0_curr-usd_lang-en-us_mcid-10_dev-dsk_losb-1_bw-14_bwb-8_pg-2_dd-0_gsb-2_sl-0_w-0_tstar-0_trat-0_tprc-tprcd_tamnt-0_cod-1686221737_trvref-b8f1df9c-b94e-3405-8fba-fa6fe97664a3&sid=3c71e3bf4c355c7c37cfa3806fac6926&aid=340295&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_id=-2103603&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=21e69ffabcdb01be&ac_meta=GhAyMWU2OWZmYWJjZGIwMWJlIAAoATICZW46Bm1hbmFsaUAASgBQAA%3D%3D&checkin=2023-06-22&checkout=2023-06-23&group_adults=2&no_rooms=1&group_children=0",
  newyork: "https://www.booking.com/searchresults.html?ss=New+York%2C+New+York+State%2C+United+States&ssne=Man%C4%81li&ssne_untouched=Man%C4%81li&highlighted_hotels=1484822&label=metatrivago-hotel-1484822_xqdz-cf6e40_los-1_nrm-1_gstadt-2_gstkid-0_curr-usd_lang-en-us_mcid-10_dev-dsk_losb-1_bw-14_bwb-8_pg-2_dd-0_gsb-2_sl-0_w-0_tstar-0_trat-0_tprc-tprcd_tamnt-0_cod-1686221737_trvref-b8f1df9c-b94e-3405-8fba-fa6fe97664a3&sid=3c71e3bf4c355c7c37cfa3806fac6926&aid=340295&lang=en-us&sb=1&src_elem=sb&src=searchresults&dest_id=20088325&dest_type=city&ac_position=0&ac_click_type=b&ac_langcode=en&ac_suggestion_list_length=5&search_selected=true&search_pageview_id=71b2a01c7d41015f&ac_meta=GhA3MWIyYTAxYzdkNDEwMTVmIAAoATICZW46B25ld3lvcmtAAEoAUAA%3D&checkin=2023-06-22&checkout=2023-06-23&group_adults=2&no_rooms=1&group_children=0",
};

const scrapeHotelsByDestination = async (destination) => {
  try {
    // Ensure the destination is valid
    if (!links[destination]) {
      throw new Error(`Invalid destination: ${destination}`);
    }

    const url = links[destination];
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const scrapedData = [];

    $('.d4924c9e74 [data-testid="property-card-container"]').each((index, element) => {
      const childTitle = $(element).find(".fcab3ed991.a23c043802").text();
      const childImage = $(element).find("img.f9671d49b1").attr("src") || "";
      const location = $(element).find('[data-testid="address"]').text();
      const price = $(element)
        .find('[data-testid="price-and-discounted-price"]')
        .text();
      const cheapestPrice = price.replace(/\$US/g, "").trim();
      const newString = childImage.replace(/\\/g, "");
      const distance = $(element).find('[data-testid="distance"]').text();

      const childData = {
        _id: uuidv4(),
        title: childTitle,
        photos: newString,
        location: location,
        cheapestPrice: cheapestPrice,
        distance:distance
      };

      scrapedData.push(childData);
    });

    return scrapedData;
  } catch (err) {
    console.error(`Error scraping hotels for destination ${destination}:`, err);
    throw err;
  }
};

export default scrapeHotelsByDestination;

