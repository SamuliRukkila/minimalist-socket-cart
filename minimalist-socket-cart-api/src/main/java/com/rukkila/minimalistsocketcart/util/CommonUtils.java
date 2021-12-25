package com.rukkila.minimalistsocketcart.util;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CommonUtils {
    private static final Logger log = LoggerFactory.getLogger(CommonUtils.class);

    public static String toLowerCaseAndAppendWildCard(String word) {
        if (StringUtils.isNotBlank(word)) {
            return "%" + word.toLowerCase() + "%";
        }
        return "";
    }
}
