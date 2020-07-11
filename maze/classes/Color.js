<?php
class Color {
	const MIN_HUE = 10;
	const MAX_HUE = 360;
	const MIN_LUM = 45;
	const MAX_LUM = 99;
	const CHANGE_VARIANCE = 1;
	const WHITE_CHANGE = 0;
	const BLACK_CHANGE = 0;

	public $r = -1;
	public $g = -1;
	public $b = -1;
	
	public function __construct($r, $g, $b) {
		$this->r = $this->clamp($r);
		$this->g = $this->clamp($g);
		$this->b = $this->clamp($b);
	}
	
	public function mutate() {
		#return $this->mutateStep();
		#return $this->mutateRGB();
		return $this->mutateHSV();
	}
	
	private function clamp($value) {
		return round(max(0, min(255, $value)));
	}
	
	private function mutateStep() {
		echo "Here0: ".$this->r." - ".$this->g." - ".$this->b."!\n";
		$color = new ImagickPixel("rgb(".($this->r / 255 * 100)."%, ".($this->g / 255 * 100)."%, ".($this->b / 255 * 100)."%)");
		#$color = new ImagickPixel("hsl(360, 100%, 100%)");
		#print_r($color->getColor());
		$hsl = $color->getHSL();
		#print_r($color->getHSL());
		
		$new_hue = round($hsl["hue"] * 360);
		$new_sat = round($hsl["saturation"] * 100);
		$new_lum = round($hsl["luminosity"] * 100);
		echo " Here1: ".$new_hue." - ".$new_sat." - ".$new_lum."!\n";
		
		if ($new_lum + 1 > Color::MAX_LUM) {
			echo "   Reset!\n";
			$new_lum = Color::MIN_LUM;
			$new_hue++;
			if ($new_hue >= Color::MAX_HUE) {
				echo "    Reset2!\n";
				$new_hue = Color::MIN_HUE;
			}
			#$new_hue = $new_hue % 360;
		}
		else {
			$new_lum++;
		}
		echo "  Here2: ".$new_hue." - ".$new_sat." - ".$new_lum."!\n";
		
		$color = new ImagickPixel("hsl(".$new_hue.", 100%, ".$new_lum."%)");
		$rgb = $color->getColor();
		#print_r($color->getHSL());
		print_r($color->getColor());
		#die;
		
		return new Color($rgb["r"], $rgb["g"], $rgb["b"]);
		
		echo "Here0: ".$this->r." - ".$this->g." - ".$this->b."!\n";
		list($h, $s, $l) = $this->rgb2hsl($this->r, $this->g, $this->b);
		echo " Here1: ".$h." - ".$s." - ".$l."!\n";
		if ($l * 100 == 100) {
			$h = (($h * 360) + 1) / 360;
			if ($h < 0) {
				$h++;
			}
			elseif ($h > 1) {
				$h--;
			}
		}
		else {
			$l = (($l * 100) + 1) / 100;
		}
		echo "  Here2: ".$h." - ".$s." - ".$l."!\n";
		
		list($r, $g, $b) = $this->hsl2rgb($h, $s, $l);
		echo "   Here3: ".$r." - ".$g." - ".$b."!\n";
		
		return new Color($r, $g, $b);
	}
	
	const RED_CHANGE = 0;
	const GREEN_CHANGE = 0;
	const BLUE_CHANGE = 0;
	private function mutateRGB() {
		$new_r = round($this->gaussianRand() * Color::CHANGE_VARIANCE) + $this->r + Color::RED_CHANGE + Color::WHITE_CHANGE - Color::BLACK_CHANGE;
		$new_g = round($this->gaussianRand() * Color::CHANGE_VARIANCE) + $this->g + Color::GREEN_CHANGE + Color::WHITE_CHANGE - Color::BLACK_CHANGE;
		$new_b = round($this->gaussianRand() * Color::CHANGE_VARIANCE) + $this->b + Color::BLUE_CHANGE + Color::WHITE_CHANGE - Color::BLACK_CHANGE;
		
		return new Color($new_r, $new_g, $new_b);
	}
	
	const HUE_CHANGE = 0;
	const SAT_CHANGE = 0;
	const LUM_CHANGE = 0;
	private function mutateHSV() {
		list($h, $s, $l) = $this->rgb2hsl($this->r, $this->g, $this->b);
		$new_hue = (round($this->gaussianRand() * Color::CHANGE_VARIANCE) + ($h * 360) + Color::HUE_CHANGE) / 360;
		$new_sat = $s;//(round($this->gaussianRand() * Color::CHANGE_VARIANCE) + ($s * 100) + Color::SAT_CHANGE - Color::WHITE_CHANGE + Color::BLACK_CHANGE) / 100;
		$new_lum = (round($this->gaussianRand() * Color::CHANGE_VARIANCE) + ($l * 100) + Color::LUM_CHANGE + Color::WHITE_CHANGE - Color::BLACK_CHANGE) / 100;
		list($r, $g, $b) = $this->hsl2rgb($new_hue, 1, $new_lum);
		#echo "Here0: ".$new_hue."!\n";
		return new Color($r, $g, $b);
		die;
		
		$color = new ImagickPixel("rgb(".($this->r / 255 * 100)."%, ".($this->g / 255 * 100)."%, ".($this->b / 255 * 100)."%)");
		#$color = new ImagickPixel("hsl(360, 100%, 100%)");
		print_r($color->getColor());
		$hsl = $color->getHSL();
		print_r($color->getHSL());
		
		//*
		$new_hue = $hsl["hue"];
		$new_sat = $hsl["saturation"];
		$new_lum = $hsl["luminosity"];
		//*/
		
		//*
		$new_hue = (round($this->gaussianRand() * Color::CHANGE_VARIANCE) + ($hsl["hue"] * 360) + Color::HUE_CHANGE) / 360;
		#echo "Here0: ".$new_hue."!\n";
		#$new_sat = (round($this->gaussianRand() * Color::CHANGE_VARIANCE) + ($hsl["saturation"] * 100) + Color::SAT_CHANGE - Color::WHITE_CHANGE + Color::BLACK_CHANGE) / 100;
		#echo "Here1: ".$new_sat."!\n";
		$new_lum = (round($this->gaussianRand() * Color::CHANGE_VARIANCE) + ($hsl["luminosity"] * 100) + Color::LUM_CHANGE + Color::WHITE_CHANGE - Color::BLACK_CHANGE) / 100;
		#echo "Here2: ".$new_lum."!\n";
		//*/
		$color->setHSL($new_hue, $new_sat, $new_lum);
		print_r($color->getHSL());
		$rgb = $color->getColor();
		print_r($color->getColor());
		#die;
		
		return new Color($rgb["r"], $rgb["g"], $rgb["b"]);
	}
	
	private function gaussianRand($mean=0, $sd=1) {
		$x = mt_rand() / mt_getrandmax();
		$y = mt_rand() / mt_getrandmax();
		
		return sqrt(-2 * log($x)) * cos(2 * pi() * $y) * $sd + $mean;
	}
	
	private function color_pad($value) {
		return str_pad(dechex($value), 2, "0", STR_PAD_LEFT);
	}
	
	public function __toString() {
		return "#".$this->color_pad($this->r).$this->color_pad($this->g).$this->color_pad($this->b);
	}
	
	private function rgb2hsl($r, $g, $b) {
		$min = min($r, $g, $b);
		$max = max($r, $g, $b);
		$delta = $max - $min;
		
		$hue = 0;
		$sat = 0;
		$lum = ($max + $min) / 510;
		if ($delta != 0) {
			$sat = $delta / (510 - $max - $min);
			if ($lum < .5) {
				$sat = $delta / ($max + $min);
			}
			
			$div = 6 * $delta;
			if ($max == $r) {
				$hue = ($g - $b) / $div;
			}
			elseif ($max == $g) {
				$hue = 1 / 3 + ($b - $r) / $div;
			}
			elseif ($max == $b) {
				$hue = 2 / 3 + ($r - $g) / $div;
			}
	
			if ($hue < 0) $hue++;
			if ($hue > 1) $hue--;
		}
	
		return array($hue, $sat, $lum);
	}
	
	private function hsl2rgb($hue, $sat, $lum) {
		$r = $g = $b = $lum * 255;
		if ($sat != 0) {
			$q = ($lum < 0.5 ? $lum * (1 + $sat) : ($lum + $sat - $lum * $sat));
			$p = 2 * $lum - $q;
			$r = $this->hue2rgb($hue + 1/3, $p, $q);
			$g = $this->hue2rgb($hue, $p, $q);
			$b = $this->hue2rgb($hue - 1/3, $p, $q);
			
			$r = round($r * 255);
			$g = round($g * 255);
			$b = round($b * 255);
			/*
			$var_H = $hue * 6;
			$var_i = floor($var_H);
			$var_1 = $lum * (1 - $sat);
			$var_2 = $lum * (1 - $sat * ($var_H - $var_i));
			$var_3 = $lum * (1 - $sat * (1 - ($var_H - $var_i)));
			
			if ($var_i == 0) { $var_R = $lum; $var_G = $var_3; $var_B = $var_1; }
			else if ($var_i == 1) { $var_R = $var_2; $var_G = $lum; $var_B = $var_1; }
			else if ($var_i == 2) { $var_R = $var_1; $var_G = $lum; $var_B = $var_3; }
			else if ($var_i == 3) { $var_R = $var_1; $var_G = $var_2; $var_B = $lum; }
			else if ($var_i == 4) { $var_R = $var_3; $var_G = $var_1; $var_B = $lum; }
			else { $var_R = $lum; $var_G = $var_1; $var_B = $var_2; }
			
			$r = round($var_R * 255);
			$g = round($var_G * 255);
			$b = round($var_B * 255);
			*/
		}
		
		return array($r, $g, $b);
	}
	
	private function hue2rgb($hue, $sat, $lum) {
		if ($hue < 0) {
			$hue++;
		}
		elseif ($hue > 1) {
			$hue--;
		}
		elseif ($hue < 1 / 6) {
			return $sat + ($lum - $sat) * 6 * $hue;
		}
		elseif ($hue < 1 / 2) {
			return $lum;
		}
		elseif ($hue < 2 / 3) {
			return $sat + ($lum - $sat) * (2 / 3 - $hue) * 6;
		}
		
		return $sat;
	
		$r = $g = $b = $lum * 255;
		if ($sat != 0) {
			$var_H = $hue * 6;
			$var_i = floor($var_H);
			$var_1 = $lum * (1 - $sat);
			$var_2 = $lum * (1 - $sat * ($var_H - $var_i));
			$var_3 = $lum * (1 - $sat * (1 - ($var_H - $var_i)));
			
			if ($var_i == 0) { $var_R = $lum; $var_G = $var_3; $var_B = $var_1; }
			else if ($var_i == 1) { $var_R = $var_2; $var_G = $lum; $var_B = $var_1; }
			else if ($var_i == 2) { $var_R = $var_1; $var_G = $lum; $var_B = $var_3; }
			else if ($var_i == 3) { $var_R = $var_1; $var_G = $var_2; $var_B = $lum; }
			else if ($var_i == 4) { $var_R = $var_3; $var_G = $var_1; $var_B = $lum; }
			else { $var_R = $lum; $var_G = $var_1; $var_B = $var_2; }
			
			$r = round($var_R * 255);
			$g = round($var_G * 255);
			$b = round($var_B * 255);
		}
		
		return array($r, $g, $b);
	}
	
	public static function colorFromHue($hue, $sat=100, $lum=50) {
		#echo "H: ".$hue.", S: ".$sat.", L: ".$lum."\n";
		$color = new ImagickPixel("hsl(".$hue.", ".$sat."%, ".$lum."%)");
		$rgb = $color->getColor();
		
		return new Color($rgb["r"], $rgb["g"], $rgb["b"]);
	}
}
?>