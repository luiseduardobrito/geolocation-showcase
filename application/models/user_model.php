<?php

class User_model extends CI_Model {

	public function __construct()
	{
		parent::__construct();
	}

	public function getAll(){
		return $this->get(array());
	}

	public function getNearLocation($lat, $lng, $d) {

		$q = $this->db->query("

			SET 
			-- target
			@lat = ".$lat.", 
			@lng = ".$lng.",
			-- range (Km)
			@raio = ".$d.";

			select result.cityId, city, user.userId, user.userName, result.distance FROM 
			(
				select  cityId, city,
				( 
					-- 3959 result as miles
					-- 6371 result as Km
					6371 
					* acos( cos( radians(@lat) ) 
					* cos( radians( latitude ) ) 
					* cos( radians( longitude ) 
					- radians(@lng) ) 
					+ sin( radians(@lat) ) 
					* sin( radians( latitude ) ) ) 
				)
				AS distance 
				FROM city_location
				HAVING distance < @raio
				ORDER BY distance
			) 
			AS result
			INNER JOIN user
			ON user.cityId=result.cityId;
		");
	}

	private function get($rest)
	{
		$this->db->select("*");
		$this->db->from("user");
		$this->db->join("city_location", "user.cityId = city_location.cityId");
		$this->db->where($rest);

		$q = $this->db->get();

		if(!$q || !$q->num_rows())
			return array();

		else
			return $q->result_array();
	}
}
